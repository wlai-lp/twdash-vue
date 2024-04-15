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
    SELECT_TODAY_BATCHES = "SELECT count(*) from batch_run where start_timestamp >= strftime('%s', 'now', 'start of day') * 1000",
    SELECT_ALL_MSG_HIST = "SELECT * FROM msg_history_call order by msg_history_call_id desc limit 10",
    SELECT_ALL_JSON_LOCAL = "SELECT * FROM save_json_local order by save_json_local_id desc limit 10",
    SELECT_ALL_ATTACHMENT = "SELECT * FROM save_attachment_local order by save_attachment_local_id desc limit 10",
    SELECT_COUNT_ALL_BATCHES = "SELECT count(*) FROM batch_run",
    SELECT_COUNT_ALL_HISTORY = "SELECT count(*) FROM msg_history_call",
    SELECT_COUNT_ALL_ATTACHMENT = "SELECT count(*) FROM save_attachment_local",
    DELETE_USER = "DELETE FROM users WHERE id = ?"
}