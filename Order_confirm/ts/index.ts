import { doPost } from "./doFunction";
// import { test } from "./test";

declare const global: {
    [x: string]: unknown;
};

global.doPost = doPost;
// global.test = test;
