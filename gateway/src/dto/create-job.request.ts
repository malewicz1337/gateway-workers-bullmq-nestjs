type JobIdentifier = 'cmd1' | 'cmd2' | 'cmd3';

export class CreateJobRequest {
  id: string;
  payload: string;
  identifier: JobIdentifier;
}
