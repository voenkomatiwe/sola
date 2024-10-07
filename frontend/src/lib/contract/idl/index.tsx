export type SubService = {
  version: "0.1.0";
  name: "sub_service";
  instructions: [
    {
      name: "initializeContractState";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        },
        {
          name: "programAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "programData";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "authority";
          type: "publicKey";
        },
        {
          name: "paymentDelegate";
          type: "publicKey";
        },
        {
          name: "commissionOwner";
          type: "publicKey";
        },
        {
          name: "commission";
          type: "u64";
        },
        {
          name: "bump";
          type: "u8";
        },
      ];
    },
    {
      name: "setStateAuthority";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "authority";
          type: "publicKey";
        },
      ];
    },
    {
      name: "setStatePaymentDelegate";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "paymentDelegate";
          type: "publicKey";
        },
      ];
    },
    {
      name: "setStateCommissionOwner";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "commissionOwner";
          type: "publicKey";
        },
      ];
    },
    {
      name: "setStateCommission";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "commission";
          type: "u64";
        },
      ];
    },
    {
      name: "replenishUserStorage";
      accounts: [
        {
          name: "sender";
          isMut: true;
          isSigner: true;
        },
        {
          name: "user";
          isMut: true;
          isSigner: false;
        },
        {
          name: "senderTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "bump";
          type: "u8";
        },
      ];
    },
    {
      name: "withdrawFromUserStorage";
      accounts: [
        {
          name: "sender";
          isMut: false;
          isSigner: true;
        },
        {
          name: "user";
          isMut: true;
          isSigner: false;
        },
        {
          name: "senderTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
      ];
    },
    {
      name: "createService";
      accounts: [
        {
          name: "sender";
          isMut: true;
          isSigner: true;
        },
        {
          name: "service";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "serviceId";
          type: "u128";
        },
        {
          name: "name";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "url";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "authority";
          type: "publicKey";
        },
        {
          name: "subscriptionPeriod";
          type: {
            option: "i64";
          };
        },
        {
          name: "subPrice";
          type: "u64";
        },
        {
          name: "bump";
          type: "u8";
        },
      ];
    },
    {
      name: "removeService";
      accounts: [
        {
          name: "sender";
          isMut: true;
          isSigner: true;
        },
        {
          name: "service";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: "updateServiceAuthority";
      accounts: [
        {
          name: "sender";
          isMut: true;
          isSigner: true;
        },
        {
          name: "service";
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "authority";
          type: "publicKey";
        },
      ];
    },
    {
      name: "updateServiceName";
      accounts: [
        {
          name: "sender";
          isMut: true;
          isSigner: true;
        },
        {
          name: "service";
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "name";
          type: {
            array: ["u8", 32];
          };
        },
      ];
    },
    {
      name: "updateServiceUrl";
      accounts: [
        {
          name: "sender";
          isMut: true;
          isSigner: true;
        },
        {
          name: "service";
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "url";
          type: {
            array: ["u8", 32];
          };
        },
      ];
    },
    {
      name: "updateServiceSubscriptionPeriod";
      accounts: [
        {
          name: "sender";
          isMut: true;
          isSigner: true;
        },
        {
          name: "service";
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "subscriptionPeriod";
          type: "i64";
        },
      ];
    },
    {
      name: "updateServiceMint";
      accounts: [
        {
          name: "sender";
          isMut: true;
          isSigner: true;
        },
        {
          name: "service";
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "mint";
          type: "publicKey";
        },
      ];
    },
    {
      name: "updateServicePrice";
      accounts: [
        {
          name: "sender";
          isMut: true;
          isSigner: true;
        },
        {
          name: "service";
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "price";
          type: "u64";
        },
      ];
    },
    {
      name: "withdrawFromServiceStorage";
      accounts: [
        {
          name: "sender";
          isMut: false;
          isSigner: true;
        },
        {
          name: "service";
          isMut: true;
          isSigner: false;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        },
        {
          name: "senderTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "serviceTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "commissionOwnerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
      ];
    },
    {
      name: "activateSubscription";
      accounts: [
        {
          name: "sender";
          isMut: true;
          isSigner: true;
        },
        {
          name: "subscription";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: false;
        },
        {
          name: "service";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "serviceTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "bump";
          type: "u8";
        },
      ];
    },
    {
      name: "deactivateSubscription";
      accounts: [
        {
          name: "sender";
          isMut: true;
          isSigner: true;
        },
        {
          name: "subscription";
          isMut: true;
          isSigner: false;
        },
        {
          name: "service";
          isMut: true;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: "chargeSubscriptionPayment";
      accounts: [
        {
          name: "sender";
          isMut: true;
          isSigner: true;
        },
        {
          name: "subscription";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: false;
        },
        {
          name: "service";
          isMut: false;
          isSigner: false;
        },
        {
          name: "state";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "serviceTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
  ];
  accounts: [
    {
      name: "state";
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            docs: ["Account version"];
            type: "u8";
          },
          {
            name: "bump";
            docs: ["Seed bump for PDA"];
            type: "u8";
          },
          {
            name: "authority";
            docs: ["Contract authority"];
            type: "publicKey";
          },
          {
            name: "paymentDelegate";
            docs: [
              "Public key of the delegate wallet that can be used for charging subscription payments",
            ];
            type: "publicKey";
          },
          {
            name: "commissionOwner";
            docs: ["Public key of the commission wallet"];
            type: "publicKey";
          },
          {
            name: "commission";
            docs: ["Sub service commission"];
            type: "u64";
          },
          {
            name: "updatedAt";
            docs: ["Timestamp when the state was last updated"];
            type: "i64";
          },
        ];
      };
    },
    {
      name: "service";
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            docs: ["Account version"];
            type: "u16";
          },
          {
            name: "bump";
            docs: ["Seed bump for PDA"];
            type: "u8";
          },
          {
            name: "id";
            docs: ["Service UUID"];
            type: "u128";
          },
          {
            name: "name";
            docs: ["Service name"];
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "url";
            docs: ["Service url"];
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "authority";
            docs: ["Service authority"];
            type: "publicKey";
          },
          {
            name: "mint";
            docs: ["Subscription mint"];
            type: "publicKey";
          },
          {
            name: "subscriptionPeriod";
            docs: ["Subscription price"];
            type: "i64";
          },
          {
            name: "subPrice";
            docs: ["Subscription price"];
            type: "u64";
          },
          {
            name: "subscribersCount";
            docs: ["Amount of subscription"];
            type: "u64";
          },
          {
            name: "updatedAt";
            docs: ["Timestamp when the state was last updated"];
            type: "i64";
          },
        ];
      };
    },
    {
      name: "subscription";
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            docs: ["Account version"];
            type: "u16";
          },
          {
            name: "bump";
            docs: ["Seed bump for PDA"];
            type: "u8";
          },
          {
            name: "serviceId";
            docs: ["Service UUID"];
            type: "u128";
          },
          {
            name: "user";
            docs: ["User wallet address"];
            type: "publicKey";
          },
          {
            name: "isActive";
            docs: ["User wallet PDA address"];
            type: "bool";
          },
          {
            name: "lastPayment";
            docs: ["Whether the subscription is active"];
            type: "i64";
          },
        ];
      };
    },
    {
      name: "user";
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            docs: ["Account version"];
            type: "u16";
          },
          {
            name: "bump";
            docs: ["Seed bump for PDA"];
            type: "u8";
          },
          {
            name: "address";
            docs: ["User wallet address"];
            type: "publicKey";
          },
        ];
      };
    },
  ];
  errors: [
    {
      code: 6000;
      name: "AuthorityMismatch";
      msg: "Authority mismatched";
    },
    {
      code: 6001;
      name: "InvalidProgramData";
      msg: "Invalid program data account";
    },
    {
      code: 6002;
      name: "InvalidProgramAccount";
      msg: "Invalid program account";
    },
    {
      code: 6003;
      name: "IllegalOwner";
      msg: "Account has illegal owner";
    },
    {
      code: 6004;
      name: "InvalidToken";
      msg: "Invalid token account";
    },
    {
      code: 6005;
      name: "InvalidUUID";
      msg: "Invalid UUID";
    },
    {
      code: 6006;
      name: "PresentSubscriptions";
      msg: "Service can be removed only if it has no subscriptions";
    },
    {
      code: 6007;
      name: "ValueOverflow";
      msg: "Value overflow occurred";
    },
    {
      code: 6008;
      name: "UntimelyPayment";
      msg: "Untimely subscription payment";
    },
    {
      code: 6009;
      name: "SubscriptionAlreadyActive";
      msg: "Subscription already active";
    },
    {
      code: 6010;
      name: "SubscriptionInactive";
      msg: "Subscription already inactive";
    },
    {
      code: 6011;
      name: "InvalidFee";
      msg: "Invalid fee amount";
    },
    {
      code: 6012;
      name: "InvalidData";
      msg: "Invalid Data";
    },
  ];
};

export const IDL: SubService = {
  version: "0.1.0",
  name: "sub_service",
  instructions: [
    {
      name: "initializeContractState",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
        {
          name: "programAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "programData",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "authority",
          type: "publicKey",
        },
        {
          name: "paymentDelegate",
          type: "publicKey",
        },
        {
          name: "commissionOwner",
          type: "publicKey",
        },
        {
          name: "commission",
          type: "u64",
        },
        {
          name: "bump",
          type: "u8",
        },
      ],
    },
    {
      name: "setStateAuthority",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "authority",
          type: "publicKey",
        },
      ],
    },
    {
      name: "setStatePaymentDelegate",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "paymentDelegate",
          type: "publicKey",
        },
      ],
    },
    {
      name: "setStateCommissionOwner",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "commissionOwner",
          type: "publicKey",
        },
      ],
    },
    {
      name: "setStateCommission",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "commission",
          type: "u64",
        },
      ],
    },
    {
      name: "replenishUserStorage",
      accounts: [
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "user",
          isMut: true,
          isSigner: false,
        },
        {
          name: "senderTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "bump",
          type: "u8",
        },
      ],
    },
    {
      name: "withdrawFromUserStorage",
      accounts: [
        {
          name: "sender",
          isMut: false,
          isSigner: true,
        },
        {
          name: "user",
          isMut: true,
          isSigner: false,
        },
        {
          name: "senderTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "createService",
      accounts: [
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "service",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "serviceId",
          type: "u128",
        },
        {
          name: "name",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "url",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "authority",
          type: "publicKey",
        },
        {
          name: "subscriptionPeriod",
          type: {
            option: "i64",
          },
        },
        {
          name: "subPrice",
          type: "u64",
        },
        {
          name: "bump",
          type: "u8",
        },
      ],
    },
    {
      name: "removeService",
      accounts: [
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "service",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "updateServiceAuthority",
      accounts: [
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "service",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "authority",
          type: "publicKey",
        },
      ],
    },
    {
      name: "updateServiceName",
      accounts: [
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "service",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "name",
          type: {
            array: ["u8", 32],
          },
        },
      ],
    },
    {
      name: "updateServiceUrl",
      accounts: [
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "service",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "url",
          type: {
            array: ["u8", 32],
          },
        },
      ],
    },
    {
      name: "updateServiceSubscriptionPeriod",
      accounts: [
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "service",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "subscriptionPeriod",
          type: "i64",
        },
      ],
    },
    {
      name: "updateServiceMint",
      accounts: [
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "service",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "mint",
          type: "publicKey",
        },
      ],
    },
    {
      name: "updateServicePrice",
      accounts: [
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "service",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "price",
          type: "u64",
        },
      ],
    },
    {
      name: "withdrawFromServiceStorage",
      accounts: [
        {
          name: "sender",
          isMut: false,
          isSigner: true,
        },
        {
          name: "service",
          isMut: true,
          isSigner: false,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
        {
          name: "senderTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "serviceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "commissionOwnerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "activateSubscription",
      accounts: [
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "subscription",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: false,
        },
        {
          name: "service",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "serviceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "bump",
          type: "u8",
        },
      ],
    },
    {
      name: "deactivateSubscription",
      accounts: [
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "subscription",
          isMut: true,
          isSigner: false,
        },
        {
          name: "service",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "chargeSubscriptionPayment",
      accounts: [
        {
          name: "sender",
          isMut: true,
          isSigner: true,
        },
        {
          name: "subscription",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: false,
        },
        {
          name: "service",
          isMut: false,
          isSigner: false,
        },
        {
          name: "state",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "serviceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "state",
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            docs: ["Account version"],
            type: "u8",
          },
          {
            name: "bump",
            docs: ["Seed bump for PDA"],
            type: "u8",
          },
          {
            name: "authority",
            docs: ["Contract authority"],
            type: "publicKey",
          },
          {
            name: "paymentDelegate",
            docs: [
              "Public key of the delegate wallet that can be used for charging subscription payments",
            ],
            type: "publicKey",
          },
          {
            name: "commissionOwner",
            docs: ["Public key of the commission wallet"],
            type: "publicKey",
          },
          {
            name: "commission",
            docs: ["Sub service commission"],
            type: "u64",
          },
          {
            name: "updatedAt",
            docs: ["Timestamp when the state was last updated"],
            type: "i64",
          },
        ],
      },
    },
    {
      name: "service",
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            docs: ["Account version"],
            type: "u16",
          },
          {
            name: "bump",
            docs: ["Seed bump for PDA"],
            type: "u8",
          },
          {
            name: "id",
            docs: ["Service UUID"],
            type: "u128",
          },
          {
            name: "name",
            docs: ["Service name"],
            type: {
              array: ["u8", 32],
            },
          },
          {
            name: "url",
            docs: ["Service url"],
            type: {
              array: ["u8", 32],
            },
          },
          {
            name: "authority",
            docs: ["Service authority"],
            type: "publicKey",
          },
          {
            name: "mint",
            docs: ["Subscription mint"],
            type: "publicKey",
          },
          {
            name: "subscriptionPeriod",
            docs: ["Subscription price"],
            type: "i64",
          },
          {
            name: "subPrice",
            docs: ["Subscription price"],
            type: "u64",
          },
          {
            name: "subscribersCount",
            docs: ["Amount of subscription"],
            type: "u64",
          },
          {
            name: "updatedAt",
            docs: ["Timestamp when the state was last updated"],
            type: "i64",
          },
        ],
      },
    },
    {
      name: "subscription",
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            docs: ["Account version"],
            type: "u16",
          },
          {
            name: "bump",
            docs: ["Seed bump for PDA"],
            type: "u8",
          },
          {
            name: "serviceId",
            docs: ["Service UUID"],
            type: "u128",
          },
          {
            name: "user",
            docs: ["User wallet address"],
            type: "publicKey",
          },
          {
            name: "isActive",
            docs: ["User wallet PDA address"],
            type: "bool",
          },
          {
            name: "lastPayment",
            docs: ["Whether the subscription is active"],
            type: "i64",
          },
        ],
      },
    },
    {
      name: "user",
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            docs: ["Account version"],
            type: "u16",
          },
          {
            name: "bump",
            docs: ["Seed bump for PDA"],
            type: "u8",
          },
          {
            name: "address",
            docs: ["User wallet address"],
            type: "publicKey",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "AuthorityMismatch",
      msg: "Authority mismatched",
    },
    {
      code: 6001,
      name: "InvalidProgramData",
      msg: "Invalid program data account",
    },
    {
      code: 6002,
      name: "InvalidProgramAccount",
      msg: "Invalid program account",
    },
    {
      code: 6003,
      name: "IllegalOwner",
      msg: "Account has illegal owner",
    },
    {
      code: 6004,
      name: "InvalidToken",
      msg: "Invalid token account",
    },
    {
      code: 6005,
      name: "InvalidUUID",
      msg: "Invalid UUID",
    },
    {
      code: 6006,
      name: "PresentSubscriptions",
      msg: "Service can be removed only if it has no subscriptions",
    },
    {
      code: 6007,
      name: "ValueOverflow",
      msg: "Value overflow occurred",
    },
    {
      code: 6008,
      name: "UntimelyPayment",
      msg: "Untimely subscription payment",
    },
    {
      code: 6009,
      name: "SubscriptionAlreadyActive",
      msg: "Subscription already active",
    },
    {
      code: 6010,
      name: "SubscriptionInactive",
      msg: "Subscription already inactive",
    },
    {
      code: 6011,
      name: "InvalidFee",
      msg: "Invalid fee amount",
    },
    {
      code: 6012,
      name: "InvalidData",
      msg: "Invalid Data",
    },
  ],
};
