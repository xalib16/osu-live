declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_TYPE: "file" | "server";
        DATABASE_DIALECT: "postgresql" | "mysql" | "sqlite" | "turso" | "singlestore" | "gel";
        POSTGRES_URL: string;
    }
}