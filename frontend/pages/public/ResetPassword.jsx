import AuthLayout from "../../components/auth/AuthLayout";
import AuthSideBanner from "../../components/auth/AuthSideBanner";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <AuthLayout
      banner={<AuthSideBanner />}
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;