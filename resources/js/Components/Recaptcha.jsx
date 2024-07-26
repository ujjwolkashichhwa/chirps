import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const RecaptchaContainer = ({children, ...props}) => {
    const {route, setShouldSubmit, onSubmit, ...restProps} = props;
    
    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!executeRecaptcha) {
            console.error('Execute recaptcha function is not available');
            return;
        }
        
        try {
            const token = await executeRecaptcha(route);
            if (!token) {
                console.error('Failed to get reCAPTCHA token');
                return;
            }

            setShouldSubmit(true);
            onSubmit(token);
        } catch (error) {
            console.error('Error executing reCAPTCHA', error);
        }
    }

    return (
        <form onSubmit={handleSubmit} {...restProps}>
            {children}
        </form>
    );
}

export default function Recaptcha({ recaptchaSiteKey, children, ...props }) {
    const {route, ...restProps} = props;
    return (
        <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
            <RecaptchaContainer
                route={route}
                children={children}
                {...restProps}
            />
        </GoogleReCaptchaProvider>
    );
}
