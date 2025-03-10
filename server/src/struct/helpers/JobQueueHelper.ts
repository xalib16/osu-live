export class JobQueue {
    private queue: (() => Promise<any>)[] = [];
    private isProcessing: boolean = false;

    public addJob(operation: () => Promise<any>): Promise<any> {
        let resolveJob: (value: any) => void;
        let rejectJob: (reason?: any) => void;

        const jobPromise = new Promise<any>((resolve, reject) => {
            resolveJob = resolve;
            rejectJob = reject;
        });

        const wrappedOperation = async () => {
            try {
                const result = await operation();
                resolveJob(result);
            } catch (error) {
                resolveJob(undefined);
            }
        };

        this.queue.push(wrappedOperation);
        console.log(`Added job to queue. Queue length: ${this.queue.length}`);
        if (!this.isProcessing) {
            this.processQueue();
        }

        return jobPromise;
    }

    private async processQueue() {
        if (this.queue.length > 0 && this.isProcessing === false) {
            this.isProcessing = true;
            const operation = this.queue.shift();

            if (operation) {
                try {
                    await this.executeWithRetry(operation);
                } catch (error) {
                    console.log(`Failed to process operation:`, error);
                }
            }
            
            this.isProcessing = false;
            console.log(`Queue processed. Queue length: ${this.queue.length}`);
            this.processQueue();
        }
    }

    private async executeWithRetry(operation: () => Promise<any>, retries: number = 3, delay: number = 5000): Promise<any> {
        let attempts = 0;
        while (attempts < retries) {
            try {
                return await operation();
            } catch (error) {
                attempts++;
                console.log(error);
                await new Promise(resolve => setTimeout(resolve, delay));
            };
        };
    }
}

export const databaseQueue = new JobQueue();
