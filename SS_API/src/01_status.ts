const Status = { OK: 0, MISSED: 1 } as const;
type StatusKeys = keyof typeof Status;
type StatusValues = typeof Status[StatusKeys];
const ErrorCode = { NotExistKey: 1, TypeError: 2, ImplementError: 3, LockTimeOut: 4 } as const;
type ErrorKeys = keyof typeof ErrorCode;
type ErrorValues = typeof ErrorCode[ErrorKeys];
