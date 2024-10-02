export type SubService = {
  "version": "0.1.0",
  "name": "sub_service",
  "instructions": [
    {
      "name": "replenishUserStorage",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "senderTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "withdrawFromUserStorage",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "senderTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createService",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "serviceId",
          "type": "u128"
        },
        {
          "name": "authority",
          "type": "publicKey"
        },
        {
          "name": "subPrice",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "removeService",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateServiceAuthority",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateServiceMint",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "mint",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateServicePrice",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawFromServiceStorage",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "senderTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serviceTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "activateSubscription",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "subscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serviceTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "deactivateSubscription",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "subscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "chargeSubscriptionPayment",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "subscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "service",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serviceTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "service",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "Account version"
            ],
            "type": "u16"
          },
          {
            "name": "bump",
            "docs": [
              "Seed bump for PDA"
            ],
            "type": "u8"
          },
          {
            "name": "id",
            "docs": [
              "Service UUID"
            ],
            "type": "u128"
          },
          {
            "name": "authority",
            "docs": [
              "Service withdraw authority"
            ],
            "type": "publicKey"
          },
          {
            "name": "mint",
            "docs": [
              "Subscription mint"
            ],
            "type": "publicKey"
          },
          {
            "name": "subPrice",
            "docs": [
              "Subscription price"
            ],
            "type": "u64"
          },
          {
            "name": "subscribersCount",
            "docs": [
              "Amount of subscription"
            ],
            "type": "u64"
          },
          {
            "name": "updatedAt",
            "docs": [
              "Timestamp when the state was last updated"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "subscription",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "Account version"
            ],
            "type": "u16"
          },
          {
            "name": "bump",
            "docs": [
              "Seed bump for PDA"
            ],
            "type": "u8"
          },
          {
            "name": "serviceId",
            "docs": [
              "Service UUID"
            ],
            "type": "u128"
          },
          {
            "name": "user",
            "docs": [
              "User wallet address"
            ],
            "type": "publicKey"
          },
          {
            "name": "isActive",
            "docs": [
              "User wallet PDA address"
            ],
            "type": "bool"
          },
          {
            "name": "lastPayment",
            "docs": [
              "Whether the subscription is active"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "Account version"
            ],
            "type": "u16"
          },
          {
            "name": "bump",
            "docs": [
              "Seed bump for PDA"
            ],
            "type": "u8"
          },
          {
            "name": "address",
            "docs": [
              "User wallet address"
            ],
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AuthorityMismatch",
      "msg": "Authority mismatched"
    },
    {
      "code": 6001,
      "name": "IllegalOwner",
      "msg": "Account has illegal owner"
    },
    {
      "code": 6002,
      "name": "InvalidToken",
      "msg": "Invalid token account"
    },
    {
      "code": 6003,
      "name": "InvalidUUID",
      "msg": "Invalid UUID"
    },
    {
      "code": 6004,
      "name": "PresentSubscriptions",
      "msg": "Service can be removed only if it has no subscriptions"
    },
    {
      "code": 6005,
      "name": "ValueOverflow",
      "msg": "Value overflow occurred"
    },
    {
      "code": 6006,
      "name": "UntimelyPayment",
      "msg": "Untimely subscription payment"
    }
  ]
};

export const IDL: SubService = {
  "version": "0.1.0",
  "name": "sub_service",
  "instructions": [
    {
      "name": "replenishUserStorage",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "senderTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "withdrawFromUserStorage",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "senderTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createService",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "serviceId",
          "type": "u128"
        },
        {
          "name": "authority",
          "type": "publicKey"
        },
        {
          "name": "subPrice",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "removeService",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateServiceAuthority",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateServiceMint",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "mint",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateServicePrice",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawFromServiceStorage",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "senderTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serviceTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "activateSubscription",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "subscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serviceTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "deactivateSubscription",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "subscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "chargeSubscriptionPayment",
      "accounts": [
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "subscription",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "service",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serviceTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "service",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "Account version"
            ],
            "type": "u16"
          },
          {
            "name": "bump",
            "docs": [
              "Seed bump for PDA"
            ],
            "type": "u8"
          },
          {
            "name": "id",
            "docs": [
              "Service UUID"
            ],
            "type": "u128"
          },
          {
            "name": "authority",
            "docs": [
              "Service withdraw authority"
            ],
            "type": "publicKey"
          },
          {
            "name": "mint",
            "docs": [
              "Subscription mint"
            ],
            "type": "publicKey"
          },
          {
            "name": "subPrice",
            "docs": [
              "Subscription price"
            ],
            "type": "u64"
          },
          {
            "name": "subscribersCount",
            "docs": [
              "Amount of subscription"
            ],
            "type": "u64"
          },
          {
            "name": "updatedAt",
            "docs": [
              "Timestamp when the state was last updated"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "subscription",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "Account version"
            ],
            "type": "u16"
          },
          {
            "name": "bump",
            "docs": [
              "Seed bump for PDA"
            ],
            "type": "u8"
          },
          {
            "name": "serviceId",
            "docs": [
              "Service UUID"
            ],
            "type": "u128"
          },
          {
            "name": "user",
            "docs": [
              "User wallet address"
            ],
            "type": "publicKey"
          },
          {
            "name": "isActive",
            "docs": [
              "User wallet PDA address"
            ],
            "type": "bool"
          },
          {
            "name": "lastPayment",
            "docs": [
              "Whether the subscription is active"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "Account version"
            ],
            "type": "u16"
          },
          {
            "name": "bump",
            "docs": [
              "Seed bump for PDA"
            ],
            "type": "u8"
          },
          {
            "name": "address",
            "docs": [
              "User wallet address"
            ],
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AuthorityMismatch",
      "msg": "Authority mismatched"
    },
    {
      "code": 6001,
      "name": "IllegalOwner",
      "msg": "Account has illegal owner"
    },
    {
      "code": 6002,
      "name": "InvalidToken",
      "msg": "Invalid token account"
    },
    {
      "code": 6003,
      "name": "InvalidUUID",
      "msg": "Invalid UUID"
    },
    {
      "code": 6004,
      "name": "PresentSubscriptions",
      "msg": "Service can be removed only if it has no subscriptions"
    },
    {
      "code": 6005,
      "name": "ValueOverflow",
      "msg": "Value overflow occurred"
    },
    {
      "code": 6006,
      "name": "UntimelyPayment",
      "msg": "Untimely subscription payment"
    }
  ]
};
