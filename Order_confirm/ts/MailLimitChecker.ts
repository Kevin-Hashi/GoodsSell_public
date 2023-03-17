import { FetchUtils } from "./connect";

const planType = { payAsYouGo: "payAsYouGo", free: "free", subscription: "subscription", sms: "sms", reseller: "reseller" } as const;
type PlanType = typeof planType[keyof typeof planType];
interface accountResponse {
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
    address: {
        street: string;
        city: string;
        zipCode: string;
        country: string;
    };
    plan: {
        type: PlanType;
        credits: number;
        creditsType: "sendLimit";
    }[];
    relay: {
        enabled: boolean;
        data: {
            userName: string;
            relay: string;
            port: number;
        };
    };
    marketingAutomation: {
        key?: string;
        enabled: boolean;
    };
    [key: string]: any;
}

/** Manage how many e-mails are left to be sent. */
export class MailLimitChecker {
    protected readonly url: string = 'https://api.sendinblue.com/v3/account';
    protected _remaining: number = 0;
    get remaining(): number { return this._remaining; }
    constructor(protected readonly apiKey: string) { };
    /** Get the number of e-mails remaining. */
    getFreeMailLimit(): number {
        const response = FetchUtils.fetchRetryGET(this.url, { "api-key": this.apiKey }, undefined, (response) => response.getResponseCode() === 200);
        const remaining = (JSON.parse(response.getContentText()) as accountResponse).plan.filter(plan => plan.type === planType.free)[0]?.credits || 0;
        this._remaining = remaining;
        return remaining;
    }
    /** Call this when you send an email. */
    send(): void {
        this._remaining--;
    }
}
