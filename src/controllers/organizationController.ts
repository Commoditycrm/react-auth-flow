import { Body, JsonController, Post } from 'routing-controllers';
import * as sendgrid from '../email/sendgrid';
import {
  DeactivateOrgType,
  type DeleteOrgType,
  EmailType,
  type OrgDeactivateProps,
} from '../interfaces';
import { EnvLoader } from '../env/env.loader';
import logger from '../logger';

@JsonController('/organizations')
class OrganizationController {
  emailService: sendgrid.EmailService;
  supportEmail = EnvLoader.get('SUPPORT_EMAIL');
  constructor() {
    this.emailService = sendgrid.EmailService.getInstance();
  }

  @Post('/deactivate')
  async deActivateOrg(@Body() deactivateProps: OrgDeactivateProps) {
    const { orgName, userEmail, userName } = deactivateProps;
    if (!orgName || !userEmail || !userName) {
      throw new Error('Input Validation Error.');
    }
    logger?.info(`Dactivation email processing for ${userEmail}`);
    const sendEmailProps: DeactivateOrgType = {
      ...deactivateProps,
      type: EmailType.DEACTIVATE_ORG,
      supportEmail: this.supportEmail,
    };
    await this.emailService.orgDeactivationEmail(sendEmailProps);
    return { sussess: true };
  }
  @Post('/delete')
  async deleteOrg(@Body() deleteOrgProps: DeleteOrgType) {
    const { orgName, userEmail, userName } = deleteOrgProps;
    if (!orgName || !userEmail || !userName) {
      throw new Error('Input Validation Error.');
    }
    logger?.info(`Deleteing Org email processing for ${userEmail}`);
    const sendEmailProps: DeactivateOrgType = {
      ...deleteOrgProps,
      type: EmailType.DELETE_ORG,
      supportEmail: this.supportEmail,
    };
    await this.emailService.deleteOrgEmail(sendEmailProps);
    return { sussess: true };
  }
}

export default OrganizationController;
