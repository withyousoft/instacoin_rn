export const DEFAULT_AUCTION_DURATION = 86400;

export const AUCTION_CONTRACT = {
  // external functions
  CREATE_TOKEN_AUCTION: "createTokenAuction",
  EXECUTE_SALE: "executeSale",
  CANCEL_AUCTION: "cancelAuction",

  // payable function
  BID: "bid",

  // read-only function
  GET_TOKEN_AUCTION_DETAILS: "getTokenAuctionDetails",

  // read-only properties
  BIDS: "bids",
  TOKEN_TO_AUCTION: "tokenToAuction",
};

export const TOKEN_CONTRACT = {
  MINT_ITEM: "mintItem",
  APPROVE: "approve",
};
