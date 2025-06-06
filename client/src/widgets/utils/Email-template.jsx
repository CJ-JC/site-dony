import React from "react";

const EmailTemplate = () => {
  return (
    <section class="mx-auto max-w-2xl bg-white px-6 py-8 dark:bg-gray-900">
      <header>
        <a href="#">
          <img
            class="h-7 w-auto sm:h-8"
            src="https://merakiui.com/images/full-logo.svg"
            alt=""
          />
        </a>
      </header>

      <main class="mt-8">
        <h2 class="text-gray-700 dark:text-gray-200">Hi Olivia,</h2>

        <p class="mt-2 leading-loose text-gray-600 dark:text-gray-300">
          Alicia has invited you to join the team on{" "}
          <span class="font-semibold ">Meraki UI</span>.
        </p>

        <button class="mt-4 transform rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium capitalize tracking-wider text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
          Accept the invite
        </button>

        <p class="mt-8 text-gray-600 dark:text-gray-300">
          Thanks, <br />
          Meraki UI team
        </p>
      </main>

      <footer class="mt-8">
        <p class="text-gray-500 dark:text-gray-400">
          This email was sent to{" "}
          <a
            href="#"
            class="text-blue-600 hover:underline dark:text-blue-400"
            target="_blank"
          >
            contact@merakiui.com
          </a>
          . If you'd rather not receive this kind of email, you can{" "}
          <a href="#" class="text-blue-600 hover:underline dark:text-blue-400">
            unsubscribe
          </a>{" "}
          or{" "}
          <a href="#" class="text-blue-600 hover:underline dark:text-blue-400">
            manage your email preferences
          </a>
          .
        </p>

        <p class="mt-3 text-gray-500 dark:text-gray-400">
          © Meraki UI. All Rights Reserved.
        </p>
      </footer>
    </section>
  );
};

export default EmailTemplate;
