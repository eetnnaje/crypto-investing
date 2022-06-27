export type Price = {
  symbol: string;
  price: string;
};

export type exchangeRate = {
  data: {
    exchangeRate: {
      eth: {
        usd: number;
        __typename: string;
      };
      slp: {
        usd: number;
        __typename: string;
      };
      ron: {
        usd: number;
        __typename: string;
      };
      axs: {
        usd: number;
        __typename: string;
      };
      usd: {
        usd: number;
        __typename: string;
      };
    __typename: string;
    };
  };
};
