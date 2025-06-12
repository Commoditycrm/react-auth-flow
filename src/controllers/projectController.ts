import { Body, JsonController, Post } from 'routing-controllers';
import * as sendgrid from '../email/sendgrid';
import {
  EmailType,
  RemoveUserProps,
  type RemoveUserBodyType,
} from '../interfaces';
import logger from '../logger';

@JsonController('/project')
class ProjectController {
  emailService: sendgrid.EmailService;

  constructor() {
    this.emailService = sendgrid.EmailService.getInstance();
  }
  @Post('/remove_user')
  async removeUserFromProject(
    @Body() removeserPops: RemoveUserBodyType,
  ): Promise<{ success: boolean }> {
    const { orgName, projectName, userEmail, userName } = removeserPops;

    if (!orgName || !projectName || !userEmail || !userName) {
      throw Error('Input Validation Error');
    }
    const sendEmailProps: RemoveUserProps = {
      ...removeserPops,
      type: EmailType.REMOVE_USER_FROM_PROJECT,
    };
    logger?.info('Processing removing');
    await this.emailService.removeUserFromProject(sendEmailProps);
    return { success: true };
  }
}

export default ProjectController;
