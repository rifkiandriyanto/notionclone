import React, { useState } from "react";
import cookies from "next-cookies";

import Notice from "../components/notice";
import Input from "../components/input";

interface FormData {
  email: string;
}

interface NoticeData {
  type: string;
  message: string;
}

interface ForgotPasswordPageProps {
  token: string | undefined;
}

const form = {
  id: "forgotPassword",
  inputs: [
    {
      id: "email",
      type: "email",
      label: "E-Mail Address",
      required: true,
      value: "",
    },
  ],
  submitButton: {
    type: "submit",
    label: "Request Password Reset",
  },
};

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ token }) => {
  const RESET_NOTICE: NoticeData = { type: "", message: "" };
  const [notice, setNotice] = useState<NoticeData>(RESET_NOTICE);

  const initialValues: FormData = {};
  form.inputs.forEach((input) => (initialValues[input.id] = input.value));
  const [formData, setFormData] = useState<FormData>(initialValues);

  const handleInputChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotice(RESET_NOTICE);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users/resetToken`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
          }),
        }
      );
      const data = await response.json();
      if (data.errCode) {
        setNotice({ type: "ERROR", message: data.message });
      } else {
        setNotice({ type: "SUCCESS", message: data.message });
      }
    } catch (err) {
      console.log(err);
      setNotice({ type: "ERROR", message: "Something unexpected happened." });
    }
  };

  return (
    <>
      <h1 className="pageHeading">Forgot Password</h1>
      <form id={form.id} onSubmit={handleSubmit}>
        {form.inputs.map((input, key) => {
          return (
            <Input
              key={key}
              formId={form.id}
              id={input.id}
              type={input.type}
              label={input.label}
              required={input.required}
              value={formData[input.id]}
              setValue={(value) => handleInputChange(input.id, value)}
            />
          );
        })}
        {notice.message && (
          <Notice status={notice.type} mini>
            {notice.message}
          </Notice>
        )}
        <button type={form.submitButton.type}>{form.submitButton.label}</button>
      </form>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ForgotPasswordPageProps> = (
  context
) => {
  const { token } = cookies(context);
  const res = context.res;
  if (token) {
    res?.writeHead(302, { Location: `/pages` });
    res?.end();
  }
  return { props: { token } };
};

export default ForgotPasswordPage;
