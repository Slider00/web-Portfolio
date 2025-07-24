import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import Alert from "../components/Alert";
import { Particles } from "../components/Particles";

const Contact = () => {
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await emailjs.sendForm(
          "default_service",       // Igual que Playground
          "template_zmu9esh",      // Plantilla de auto-reply (funciona)
          formRef.current,
          "MtKoIuDJShPTvSMcd"      // Public Key
      );

      console.log("EmailJS Response:", response);
      showAlertMessage("success", "Your message has been sent!");
      e.target.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      showAlertMessage("danger", "Something went wrong! Check console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <section className="relative flex items-center c-space section-spacing" id="contact">
        <Particles
            className="absolute inset-0 -z-50"
            quantity={100}
            ease={80}
            color={"#ffffff"}
            refresh
        />
        {showAlert && <Alert type={alertType} text={alertMessage} />}
        <div className="flex flex-col items-center justify-center max-w-md p-5 mx-auto border border-white/10 rounded-2xl bg-primary">
          <div className="flex flex-col items-start w-full gap-5 mb-10">
            <h2 className="text-heading">Let's Talk</h2>
            <p className="font-normal text-neutral-400">
              Whether you're looking to build a new website, improve your existing platform,
              or bring a unique project to life, I'm here to help.
            </p>
          </div>
          <form ref={formRef} className="w-full" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="user_name" className="feild-label">Full Name</label>
              <input id="user_name" name="user_name" type="text" className="field-input field-input-focus" required />
            </div>
            <div className="mb-5">
              <label htmlFor="user_email" className="feild-label">Email</label>
              <input id="user_email" name="user_email" type="email" className="field-input field-input-focus" required />
            </div>
            <div className="mb-5">
              <label htmlFor="message" className="feild-label">Message</label>
              <textarea id="message" name="message" rows="4" className="field-input field-input-focus" required />
            </div>
            <input type="hidden" name="subject" value="New contact from website" />
            <input type="hidden" name="time" value={new Date().toLocaleString()} />
            <button
                type="submit"
                className="w-full px-1 py-3 text-lg text-center rounded-md cursor-pointer bg-radial from-lavender to-royal hover-animation"
            >
              {!isLoading ? "Send" : "Sending..."}
            </button>
          </form>
        </div>
      </section>
  );
};

export default Contact;
