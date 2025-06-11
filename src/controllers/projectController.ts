import { JsonController, Post } from 'routing-controllers';
import * as sendgrid from '../email/sendgrid';

@JsonController('/project')
class ProjectController {
  emailService: sendgrid.EmailService;
  projectEmailService: sendgrid.ProjectEmailService;

  constructor() {
    this.emailService = sendgrid.EmailService.getInstance();
  }
  @Post('/remove_user')
  async removeUserFromProject({
    projectName,
    orgName,
    userEmail,
    userName,
  }: {
    projectName: string;
    orgName: string;
    userEmail: string;
    userName: string;
  }): Promise<boolean> {
    if (!projectName || !orgName || !userEmail || !userName) {
      throw new Error('Input Validation Error');
    }
    return true;
  }
}

export default ProjectController;
