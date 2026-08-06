import AuthLayout from "../../components/auth/AuthLayout";
import AuthSideBanner from "../../components/auth/AuthSideBanner";
import LoginForm from "../../components/auth/LoginForm";

const Login = () => {

    return (

        <AuthLayout
            banner={<AuthSideBanner />}
        >

            <LoginForm />

        </AuthLayout>

    );

};

export default Login;