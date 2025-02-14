const generateResetPasswordEmail = ({ text }) => {
    return `
      <section class="mx-auto max-w-2xl bg-white px-6 py-8 dark:bg-gray-900">  
        <main class="mt-8">
            <p>Bonjour,</p>
    
            <p class="mt-2 leading-loose text-gray-600 dark:text-gray-300">
                Vous avez demandé une réinitialisation de votre mot de passe. Veuillez utiliser le lien ci-dessous pour créer un nouveau mot de passe.
            </p>
    
            <div style="margin: 20px 0;">
                ${text}
            </div>
    
             <p class="mt-2 leading-loose text-gray-600 dark:text-gray-300">
                Ce lien est valide pendant 24 heures. Si vous ne réinitialisez pas votre mot de passe dans ce délai, vous devrez effectuer une nouvelle demande.
            </p>

            <p class="mt-8 text-gray-600 dark:text-gray-300">
                Si vous n'avez pas demandé cette action, veuillez ignorer cet e-mail ou contacter le support si vous pensez que votre compte est compromis.
            </p>
        </main>
  
       <footer style="margin-top: 40px; font-size: 12px; color: #718096; line-height: 1.6; text-align: center;">
            <p style="margin-top: 10px;">Musicalement,</p>
            <p style="margin-top: 20px;">
                <a href="https://donymusic.fr" style="color: #2563eb;">www.donymusic.fr</a><br />
                <div style="margin: 5px 0;">
                    <img src="https://donymusic.fr/logo-day.svg" alt="logo-donymusic" style="width: 150px;" />
                </div>
                <br />
                123 Rue de la Musique, 75001 Paris, France <br />
                Téléphone : +33 1 23 45 67 89 <br />
                Email : <a href="mailto:contact@donymusic.com" style="color: #2563eb;">contact@donymusic.com</a>
            </p>
        </footer>
      </section>`;
};

export default generateResetPasswordEmail;
