export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            accounts: {
                Row: {
                    id: string
                    user_id: string
                    plaid_item_id: string | null
                    plaid_account_id: string | null
                    name: string
                    type: string
                    mask: string | null
                    balance: number
                    currency: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    plaid_item_id?: string | null
                    plaid_account_id?: string | null
                    name: string
                    type: string
                    mask?: string | null
                    balance?: number
                    currency?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    plaid_item_id?: string | null
                    plaid_account_id?: string | null
                    name?: string
                    type?: string
                    mask?: string | null
                    balance?: number
                    currency?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "accounts_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "accounts_plaid_item_id_fkey"
                        columns: ["plaid_item_id"]
                        referencedRelation: "plaid_items"
                        referencedColumns: ["id"]
                    }
                ]
            }
            categories: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    type: string
                    icon: string | null
                    color: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    type: string
                    icon?: string | null
                    color?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    type?: string
                    icon?: string | null
                    color?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "categories_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            transactions: {
                Row: {
                    id: string
                    user_id: string
                    account_id: string
                    category_id: string | null
                    plaid_transaction_id: string | null
                    pending: boolean
                    amount: number
                    type: string
                    description: string
                    date: string
                    payee: string | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    account_id: string
                    category_id?: string | null
                    plaid_transaction_id?: string | null
                    pending?: boolean
                    amount: number
                    type: string
                    description: string
                    date?: string
                    payee?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    account_id?: string
                    category_id?: string | null
                    plaid_transaction_id?: string | null
                    pending?: boolean
                    amount?: number
                    type?: string
                    description?: string
                    date?: string
                    payee?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "transactions_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "transactions_account_id_fkey"
                        columns: ["account_id"]
                        referencedRelation: "accounts"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "transactions_category_id_fkey"
                        columns: ["category_id"]
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    }
                ]
            }
            budgets: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    category_id: string | null
                    amount: number
                    period: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    category_id?: string | null
                    amount: number
                    period?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    category_id?: string | null
                    amount?: number
                    period?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "budgets_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "budgets_category_id_fkey"
                        columns: ["category_id"]
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    }
                ]
            }
            financial_rules: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    type: string
                    target_value: number
                    account_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    type: string
                    target_value: number
                    account_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    type?: string
                    target_value?: number
                    account_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "financial_rules_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "financial_rules_account_id_fkey"
                        columns: ["account_id"]
                        referencedRelation: "accounts"
                        referencedColumns: ["id"]
                    }
                ]
            }
            plaid_items: {
                Row: {
                    id: string
                    user_id: string
                    access_token: string
                    item_id: string
                    institution_id: string | null
                    institution_name: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    access_token: string
                    item_id: string
                    institution_id?: string | null
                    institution_name?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    access_token?: string
                    item_id?: string
                    institution_id?: string | null
                    institution_name?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "plaid_items_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
