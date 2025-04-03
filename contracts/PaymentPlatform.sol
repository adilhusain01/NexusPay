// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract PaymentPlatform {
    // Structs
    struct Seller {
        address payable walletAddress;
        string businessName;
        bool isRegistered;
        uint256 totalTransactions;
        uint256 totalAmount;
    }
    
    struct PaymentRequest {
        string paymentId;
        address payable seller;
        uint256 amount;
        uint256 expiryTime;
        bool isPaid;
        bool isExpired;
        address buyer;  // Added to track who made the payment
    }
    
    struct ClientPayment {
        string paymentId;
        address seller;
        string businessName;
        uint256 amount;
        uint256 timestamp;
    }

    struct DirectPayment {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
    }

    // State variables
    mapping(address => Seller) public sellers;
    mapping(string => PaymentRequest) public paymentRequests;
    mapping(address => PaymentRequest[]) private sellerPaymentHistory;
    mapping(address => ClientPayment[]) private clientPaymentHistory;

    // New state variables for direct payments
    mapping(address => DirectPayment[]) private clientDirectPayments;
    mapping(address => DirectPayment[]) private sellerDirectPayments;

    uint256 public constant PAYMENT_WINDOW = 180 seconds; // 3 minutes expiry time
    address public owner;
    address[] public sellerAddresses;
    uint256 public totalSellers;

 // Add new event for direct payments
    event DirectPaymentRecorded(address indexed from, address indexed to, uint256 amount, uint256 timestamp);
    
    // Events
    event SellerRegistered(address indexed sellerAddress, string businessName);
    event PaymentRequestCreated(string paymentId, address indexed seller, uint256 amount, uint256 expiryTime);
    event PaymentCompleted(string paymentId, address indexed buyer, address indexed seller, uint256 amount);
    event PaymentExpired(string paymentId);
    
    constructor() {
        owner = msg.sender;
        totalSellers = 0;
    }
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyRegisteredSeller() {
        require(sellers[msg.sender].isRegistered, "Seller not registered");
        _;
    }
    
    // Functions

   function recordDirectPayment(address recipient, uint256 amount) external {
        uint256 timestamp = block.timestamp;
        
        // Record for the sender (client)
        clientDirectPayments[msg.sender].push(DirectPayment({
            from: msg.sender,
            to: recipient,
            amount: amount,
            timestamp: timestamp
        }));

        // If recipient is a registered seller, record it in their history too
        if (sellers[recipient].isRegistered) {
            sellerDirectPayments[recipient].push(DirectPayment({
                from: msg.sender,
                to: recipient,
                amount: amount,
                timestamp: timestamp
            }));
            
            // Update seller's statistics
            Seller storage seller = sellers[recipient];
            seller.totalTransactions += 1;
            seller.totalAmount += amount;
        }
        
        emit DirectPaymentRecorded(msg.sender, recipient, amount, timestamp);
    }

     function getClientDirectPayments(address client) 
        external 
        view 
        returns (
            address[] memory recipients,
            uint256[] memory amounts,
            uint256[] memory timestamps
        ) 
    {
        DirectPayment[] memory history = clientDirectPayments[client];
        uint256 length = history.length;
        
        recipients = new address[](length);
        amounts = new uint256[](length);
        timestamps = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            recipients[i] = history[i].to;
            amounts[i] = history[i].amount;
            timestamps[i] = history[i].timestamp;
        }
        
        return (recipients, amounts, timestamps);
    }


     function getSellerDirectPayments(address seller) 
        external 
        view 
        returns (
            address[] memory payers,
            uint256[] memory amounts,
            uint256[] memory timestamps
        ) 
    {
        DirectPayment[] memory history = sellerDirectPayments[seller];
        uint256 length = history.length;
        
        payers = new address[](length);
        amounts = new uint256[](length);
        timestamps = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            payers[i] = history[i].from;
            amounts[i] = history[i].amount;
            timestamps[i] = history[i].timestamp;
        }
        
        return (payers, amounts, timestamps);
    }
    
    function registerSeller(string memory businessName) external {
        require(!sellers[msg.sender].isRegistered, "Seller already registered");
        require(bytes(businessName).length > 0, "Business name cannot be empty");
        
        sellers[msg.sender] = Seller({
            walletAddress: payable(msg.sender),
            businessName: businessName,
            isRegistered: true,
            totalTransactions: 0,
            totalAmount: 0
        });
        
        sellerAddresses.push(msg.sender);
        totalSellers++;
        
        emit SellerRegistered(msg.sender, businessName);
    }

    function getAllSellers(uint256 offset, uint256 limit) 
        external 
        view 
        onlyOwner 
        returns (
            address[] memory addresses,
            string[] memory businessNames,
            uint256[] memory transactions,
            uint256[] memory amounts
        ) 
    {
        require(offset < totalSellers, "Offset out of bounds");
        
        uint256 remaining = totalSellers - offset;
        uint256 actualLimit = remaining < limit ? remaining : limit;
        
        addresses = new address[](actualLimit);
        businessNames = new string[](actualLimit);
        transactions = new uint256[](actualLimit);
        amounts = new uint256[](actualLimit);
        
        for (uint256 i = 0; i < actualLimit; i++) {
            address sellerAddress = sellerAddresses[offset + i];
            Seller memory seller = sellers[sellerAddress];
            
            addresses[i] = sellerAddress;
            businessNames[i] = seller.businessName;
            transactions[i] = seller.totalTransactions;
            amounts[i] = seller.totalAmount;
        }
        
        return (addresses, businessNames, transactions, amounts);
    }
    
    function createPaymentRequest(string memory paymentId, uint256 amount) external onlyRegisteredSeller {
        require(amount > 0, "Amount must be greater than 0");
        require(paymentRequests[paymentId].amount == 0, "Payment ID already exists");
        
        uint256 expiryTime = block.timestamp + PAYMENT_WINDOW;
        
        paymentRequests[paymentId] = PaymentRequest({
            paymentId: paymentId,
            seller: payable(msg.sender),
            amount: amount,
            expiryTime: expiryTime,
            isPaid: false,
            isExpired: false,
            buyer: address(0)  // Initialize with zero address
        });
        
        emit PaymentRequestCreated(paymentId, msg.sender, amount, expiryTime);
    }
    
    function makePayment(string memory paymentId) external payable {
        PaymentRequest storage request = paymentRequests[paymentId];
        require(!request.isPaid, "Payment already completed");
        require(!request.isExpired, "Payment request expired");
        require(block.timestamp <= request.expiryTime, "Payment window expired");
        require(msg.value == request.amount, "Incorrect payment amount");
        
        request.isPaid = true;
        request.buyer = msg.sender;  // Record the buyer's address
        
        // Update seller statistics
        Seller storage seller = sellers[request.seller];
        seller.totalTransactions += 1;
        seller.totalAmount += msg.value;

        // Record payment in seller's history
        sellerPaymentHistory[request.seller].push(request);
        
        // Record payment in client's history
        clientPaymentHistory[msg.sender].push(ClientPayment({
            paymentId: paymentId,
            seller: request.seller,
            businessName: seller.businessName,
            amount: msg.value,
            timestamp: block.timestamp
        }));
        
        // Transfer payment to seller
        (bool sent, ) = request.seller.call{value: msg.value}("");
        require(sent, "Failed to send payment to seller");
        
        emit PaymentCompleted(paymentId, msg.sender, request.seller, msg.value);
    }

    function getSellerPaymentHistory(address seller) 
        external 
        view 
        returns (
            string[] memory paymentIds,
            address[] memory buyers,
            uint256[] memory amounts,
            uint256[] memory timestamps,
            bool[] memory isPaid
        ) 
    {
        PaymentRequest[] memory history = sellerPaymentHistory[seller];
        uint256 length = history.length;
        
        paymentIds = new string[](length);
        buyers = new address[](length);
        amounts = new uint256[](length);
        timestamps = new uint256[](length);
        isPaid = new bool[](length);
        
        for (uint256 i = 0; i < length; i++) {
            paymentIds[i] = history[i].paymentId;
            buyers[i] = history[i].buyer;
            amounts[i] = history[i].amount;
            timestamps[i] = history[i].expiryTime - PAYMENT_WINDOW;
            isPaid[i] = history[i].isPaid;
        }
        
        return (paymentIds, buyers, amounts, timestamps, isPaid);
    }


    // New function to get client's payment history
    function getClientPaymentHistory(address client) 
        external 
        view 
        returns (
            string[] memory paymentIds,
            address[] memory sellers,
            string[] memory businessNames,
            uint256[] memory amounts,
            uint256[] memory timestamps
        ) 
    {
        ClientPayment[] memory history = clientPaymentHistory[client];
        uint256 length = history.length;
        
        paymentIds = new string[](length);
        sellers = new address[](length);
        businessNames = new string[](length);
        amounts = new uint256[](length);
        timestamps = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            paymentIds[i] = history[i].paymentId;
            sellers[i] = history[i].seller;
            businessNames[i] = history[i].businessName;
            amounts[i] = history[i].amount;
            timestamps[i] = history[i].timestamp;
        }
        
        return (paymentIds, sellers, businessNames, amounts, timestamps);
    }

    // New function to get client's payment count
    function getClientPaymentCount(address client) external view returns (uint256) {
        return clientPaymentHistory[client].length;
    }
    
    function checkPaymentStatus(string memory paymentId) external view returns (
        bool isPaid,
        bool isExpired,
        uint256 remainingTime,
        address buyer  // Added buyer address to status check
    ) {
        PaymentRequest memory request = paymentRequests[paymentId];
        isPaid = request.isPaid;
        isExpired = request.isExpired || block.timestamp > request.expiryTime;
        remainingTime = block.timestamp >= request.expiryTime ? 
            0 : request.expiryTime - block.timestamp;
        buyer = request.buyer;
    }
    
    function markPaymentExpired(string memory paymentId) external {
        PaymentRequest storage request = paymentRequests[paymentId];
        require(!request.isPaid, "Payment already completed");
        require(!request.isExpired, "Payment already marked as expired");
        require(block.timestamp > request.expiryTime, "Payment window still active");
        
        request.isExpired = true;
        emit PaymentExpired(paymentId);
    }
    
    function getSellerStats(address sellerAddress) external view returns (
        string memory businessName,
        uint256 totalTransactions,
        uint256 totalAmount
    ) {
        Seller memory seller = sellers[sellerAddress];
        require(seller.isRegistered, "Seller not registered");
        return (seller.businessName, seller.totalTransactions, seller.totalAmount);
    }
}