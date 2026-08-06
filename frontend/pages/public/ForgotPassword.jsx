import AuthLayout from "../../components/auth/AuthLayout";
import AuthSideBanner from "../../components/auth/AuthSideBanner";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

const ForgotPassword = () => {

  return (

    <AuthLayout
      banner={<AuthSideBanner />}
    >

      <ForgotPasswordForm/>

    </AuthLayout>

  );

};

export default ForgotPassword;