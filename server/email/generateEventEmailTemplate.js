const generateEventEmailTemplate = ({ firstName, lastName, email, eventType, message }) => {
    const formattedMessage = message.replace(/\n/g, "<br />");

    return `
      <section class="mx-auto max-w-2xl bg-white px-6 py-8 dark:bg-gray-900">  
        <main class="mt-8">
          <p class="mt-2 leading-loose text-gray-600 dark:text-gray-300">
            Vous avez reçu un nouveau message de la part d'un utilisateur via votre site.
          </p>
  
          <div class="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-200"><strong>Nom complet : </strong> ${firstName} ${lastName} 
            <br/>
           <strong>Email du client : </strong> <a href="#" class="text-blue-600 hover:underline dark:text-blue-400" target="_blank">${email}</a> 
            <br/>
            <strong>Événement : </strong> ${eventType}
            </p>
            <p><strong>Message : </strong> ${formattedMessage}</p>
          </div>
  
          <p class="mt-8 text-gray-600 dark:text-gray-300">
            Merci de répondre rapidement à cet utilisateur pour assurer un bon suivi.
          </p>
        </main>
  
        <footer class="mt-8">  
          <p class="mt-3 text-gray-500 dark:text-gray-400">
            © Donymusic. Tous droits réservés.
          </p>
        </footer>
      </section>`;
};

export default generateEventEmailTemplate;
