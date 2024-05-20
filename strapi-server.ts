import server from "./server";

export default ({
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