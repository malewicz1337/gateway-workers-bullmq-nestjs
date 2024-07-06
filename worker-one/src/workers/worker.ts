import { SandboxedJob } from 'bullmq';

module.exports = async (job: SandboxedJob) => {
  const data = job.data;
  console.log(`Processing job ${job.id}`);

  for (let i = 0; i < 1000000000; i++) {
    for (let j = 0; j < 10; j++) {}
  }
  return data;
};
