export const generatePasswordChangeEmail = () => {
    return `
    <section class="mx-auto max-w-2xl bg-white px-6 py-8 dark:bg-gray-900"> 
        <main class="mt-8">
            <p>Bonjour,</p>
            <p class="mt-2 leading-loose text-gray-600 dark:text-gray-300"> 
            <p class="text-gray-600 dark:text-gray-300>Nous confirmons que votre mot de passe a été changé avec succès.</p>
            <p class="text-gray-600 dark:text-gray-300>Si vous n'êtes pas à l'origine de cette modification, veuillez nous contacter immédiatement à l'adresse <a href="mailto:contact@donymusic.com">contact@donymusic.com</a>.</p>
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
