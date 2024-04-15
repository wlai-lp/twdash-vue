// Define interfaces
export interface User {
    id: number;
    name: string;
    email: string;
    age?: number; // Optional property
}

// Define type aliases
export type Point = {
    x: number;
    y: number;
};

// Define enums
export enum Direction {
    Up,
    Down,
    Left,
    Right
}

export type EventData = {
    convoId: string;
    agentId: string;
    language: string;
    timestamp: number;
    date: string;
    dateTime: string;

};

export type LanguageData = {
    language: string;
    time: number;
};

export type ConvoData = {
    [convoId: string]: {
        [agentId: string]: LanguageData[];
    };
};

// bar type
export type Dataset = {
    label: string;
    backgroundColor: string;
    borderColor: string;
    data: number[];
}

export type BarData = {
    labels: string[];
    datasets: Dataset[];
}


export type TursoResult = {
    baton:    null;
    base_url: null;
    results:  ResultElement[];
}

export interface ResultElement {
    type:     string;
    response: Response;
}

export interface Response {
    type:    string;
    result?: ResponseResult;
}

export interface ResponseResult {
    cols:               Col[];
    rows:               Array<Row[]>;
    affected_row_count: number;
    last_insert_rowid:  null;
    replication_index:  string;
}

export interface Col {
    name:     string;
    decltype: string;
}

export interface Row {
    type:  Type;
    value: string;
}

export enum Type {
    Integer = "integer",
}

export enum ExportDashSQLQuery {
    SELECT_ALL_BATCHES = "SELECT * FROM batch_run order by batch_run_id desc limit 10",
    SELECT_COUNT_ALL_BATCHES = "SELECT count(*) FROM batch_run",
    INSERT_USER = "INSERT INTO users (name, email) VALUES (?, ?)",
    UPDATE_USER = "UPDATE users SET name = ?, email = ? WHERE id = ?",
    DELETE_USER = "DELETE FROM users WHERE id = ?"
}