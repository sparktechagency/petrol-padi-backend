import { model, models, Schema } from "mongoose";
import { IHelpAndSupport, ISettings } from "./Settings.interface";

//help and support model
const HelpAndSupportSchema = new Schema<IHelpAndSupport>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String,required: true },
    
}, { timestamps: true });

//! Privacy and policy
const privacySchema = new Schema<ISettings>(
  {
    description: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  },
);


//! Terms Conditions
const termsAndConditionsSchema = new Schema<ISettings>(
  {
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

const HelpAndSupportModel = models.HelpAndSupport || model<IHelpAndSupport>("HelpAndSupport", HelpAndSupportSchema);

const PrivacyPolicyModel = models.PrivacyPolicy || model('PrivacyPolicy', privacySchema);

const TermsConditionsModel = models.TermsConditions || model(
  'TermsConditions',
  termsAndConditionsSchema,
);

const SettingsModel = {
     HelpAndSupportModel,
     PrivacyPolicyModel,
     TermsConditionsModel
};

export default SettingsModel;