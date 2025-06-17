import { Body, Get, JsonController, Post, QueryParam } from 'routing-controllers';
import * as sendgrid from '../email/sendgrid';
import {
  ActivationOrgEmailProps,
  type ActivationOrgType,
  DeactivateOrgType,
  type DeleteOrgType,
  EmailType,
  type OrgDeactivateProps,
} from '../interfaces';
import { EnvLoader } from '../env/env.loader';
import logger from '../logger';
import { getStorage } from 'firebase-admin/storage';
import { FirebaseAdmin } from '../functions/admin';

@JsonController('/organizations')
class OrganizationController {
  emailService: sendgrid.EmailService;
  admin: FirebaseAdmin = FirebaseAdmin.getInstance();
  supportEmail = EnvLoader.get('SUPPORT_EMAIL');
  constructor() {
    this.emailService = sendgrid.EmailService.getInstance();
    this.admin = FirebaseAdmin.getInstance();
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
  @Post('/active')
  async activeOrg(@Body() props: ActivationOrgType) {
    const { orgName, userEmail, userName } = props;
    if (!orgName || !userEmail || !userName) {
      throw new Error('Input Validation Error');
    }
    logger?.info(`Actiavting Org email processing for ${userEmail}`);
    const link =
      EnvLoader.getOrThrow('BASE_URL') + `/my_projects?redirect=true`;
    const sendEmailProps: ActivationOrgEmailProps = {
      ...props,
      dashboardLink: link,
      type: EmailType.ACTIVATE_ORG,
    };
    console.log(link)
    await this.emailService.orgActivation(sendEmailProps);
    return { success: true };
  }

}

export default OrganizationController;
