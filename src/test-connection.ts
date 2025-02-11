import { testConnection } from './db/db';

async function main() {
    const isConnected = await testConnection();
    if (isConnected) {
        console.log('Successfully connected to Elasticsearch/OpenSearch!');
    } else {
        console.log('Failed to connect to Elasticsearch/OpenSearch');
    }
}

main().catch(console.error);
