import server from "./server";

export = () => ({
    ...server,
    config: {
        ...server.config,
        default: () => ({
        ...server.config.default,
        }),
        //@ts-ignore
        validator: (config: any) => {
        },
    },
});