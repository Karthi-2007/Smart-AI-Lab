import AuthLayout from "../../components/auth/AuthLayout";
import AuthSideBanner from "../../components/auth/AuthSideBanner";
import ActivateAccountForm from "../../components/auth/ActivateAccountForm";

const ActivateAccount = () => {
    return (

        <AuthLayout
            banner={<AuthSideBanner />}
        >

            <ActivateAccountForm />

        </AuthLayout>

    );
};

export default ActivateAccount;