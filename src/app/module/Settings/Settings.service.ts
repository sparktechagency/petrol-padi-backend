import ApiError from "../../../error/ApiError";
import { IHelpAndSupport, ISettings } from "./Settings.interface";
import SettingsModel from "./Settings.model";

//help and support service
const submitHelpAndSupportService = async (payload: IHelpAndSupport) => {

    const result = await SettingsModel.HelpAndSupportModel.create({...payload});

    if (!result) {
        throw new ApiError(500, "Failed to submit help and support request");
    }

    return result;
};

const getHelpAndSupportService = async (searchQuery: Record<string,unknown>) => {

    // let {searchText, page} = searchQuery;

    // if(searchText){
    //     const result = await SettingsModel.HelpAndSupportModel.find({
    //         $or: [
    //             { name: { $regex: searchText, $options: "i" } },
    //             { email: { $regex: searchText, $options: "i" } },
    //         ],
    //     }).lean();

    //     return result;
    // }

    //  page = page ? Number(page) : 1;

    //! pagination can be added later if needed

    // const result = await SettingsModel.HelpAndSupportModel.find({}).lean();

    // return result;
    let {page, searchText} = searchQuery;
    
    if(searchText){
        const searchedSupplier = await SettingsModel.HelpAndSupportModel.find({
            $or: [
                { name: { $regex: searchText as string, $options: "i" } },
                { email: { $regex: searchText as string, $options: "i" } },
            ],

        }).lean();
        
       return {
            meta:{ page: Number(page) || 1,limit: 10,total: searchedSupplier.length, totalPage: 1 },
            allSupport: searchedSupplier
        };
    }
    
    //add pagination later  
    page =  Number(page) || 1;
    let limit = 10;
    let skip = (page as number - 1) * limit;

    const [ allSupport, totalSupport ] = await Promise.all([
        SettingsModel.HelpAndSupportModel.find({})
            .sort({ createdAt: -1 })
                .skip(skip).limit(limit).lean(),
        SettingsModel.HelpAndSupportModel.countDocuments({}),
    ]);

    const totalPage = Math.ceil(totalSupport / limit);
     

    return {
        meta:{ page,limit: 10,total: totalSupport, totalPage },
        allSupport
    };
};

const deleteHelpAndSupportService = async (id: string) => {

    const result = await SettingsModel.HelpAndSupportModel.findByIdAndDelete(id);

    if (!result) {
        throw new ApiError(500, "Failed to delete this report.");
    }

    return result;
};


//! Privacy and policy

const getPrivacyPolicy = async () => {

  return await SettingsModel.PrivacyPolicyModel.findOne({});

};

const editPrivacyPolicy = async (id: string, payload: ISettings) => {

  
  const result = await SettingsModel.PrivacyPolicyModel.findByIdAndUpdate(id , {...payload}, {
    new: true,
    runValidators: true,
  });

  if(!result){
    throw new ApiError(500,"Failed to update privacy policy");
  }

  return result;
};

//terms and consitions

const getTermsConditions = async () => {

    return await SettingsModel.TermsConditionsModel.findOne({});

};

const editTermsConditions = async (id: string,payload: ISettings) => {

    
    const result = await SettingsModel.TermsConditionsModel.findByIdAndUpdate( id , payload, {
        new: true,
        runValidators: true,
    });

    if(!result){
        throw new ApiError(500,"failed to update Terms and conditions");
    }
    
    return result;
};

const SettingsServices = { 
    submitHelpAndSupportService,
    getHelpAndSupportService,
    deleteHelpAndSupportService,
    getPrivacyPolicy,
    editPrivacyPolicy,
    getTermsConditions,
    editTermsConditions
 };

export default SettingsServices;