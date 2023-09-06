class EnumError extends Error {
    constructor(...args) {
        super(...args);

        this.name = "EnumError";
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EnumError);
        }
    }
}

const ENUM = (obj, options) => {
    const opts = {
        strict: true,
        ...options
    };

    const enumError = (message) => {
        const extra_message = opts.name ? ` on enum '${opts.name}'` : ``;
        if (opts.strict) {
            throw new EnumError(`${message}${extra_message}`);
        }
    };

    const proxy = new Proxy({ ...obj }, {
        get: (target, key) => {
            const message = `Invalid enum key '${key}'`;

            if (target[key] === undefined) enumError(message);
            return target[key];
        },
        set: (_, key, value) => {
            const message = `Cannot modify enum (setting key '${key}' to value '${value}')`;
            enumError(message);
        },
    });
    return Object.freeze(proxy);
};
