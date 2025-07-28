import type { ContractRouterClient } from '@orpc/contract';
import type { contracts } from '@repo/shared-contracts';
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';

const rpcLink = new RPCLink({ url: `${import.meta.env.VITE_STREAMING_URL}/rpc` });

const orpcClient: ContractRouterClient<typeof contracts> = createORPCClient(rpcLink);

export const orpc = createTanstackQueryUtils(orpcClient);
