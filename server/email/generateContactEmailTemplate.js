const generateContactEmailTemplate = ({ fullname, subject, email, message }) => {
    const formattedMessage = message.replace(/\n/g, "<br>");

    return `
      <section class="mx-auto max-w-2xl bg-white px-6 py-8 dark:bg-gray-900">  
        <main class="mt-8">
          <p>Bonjour,</p>
  
          <p class="mt-2 leading-loose text-gray-600 dark:text-gray-300">
            Vous avez reçu un nouveau message de la part d'un utilisateur via votre site.
          </p>
  
          <div class="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-200">Nom complet : ${fullname}</p>
  
            <p class="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Email : ${email}</p>
  
            <p class="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Sujet : ${subject}</p>
  
            <p class="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Message : ${formattedMessage}</p>
          </div>
  
          <p class="mt-8 text-gray-600 dark:text-gray-300">
            Merci de répondre rapidement à cet utilisateur pour assurer un bon suivi.
          </p>
        </main>
  
        <footer class="mt-8">
          <p class="text-gray-500 dark:text-gray-400">
            Cet email a été envoyé automatiquement par votre site. Si vous pensez qu'il s'agit d'une erreur, veuillez vérifier vos paramètres ou contacter le support technique.
          </p>
  
          <p class="mt-3 text-gray-500 dark:text-gray-400">
            © Donymusic. Tous droits réservés.
          </p>
        </footer>
      </section>`;
};

export default generateContactEmailTemplate;
