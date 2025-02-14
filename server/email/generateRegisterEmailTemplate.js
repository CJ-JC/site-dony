const generateRegisterEmailTemplate = ({ fullname }) => {
    return `
<section class="mx-auto max-w-2xl bg-white px-6 py-8 dark:bg-gray-900">
<main style="font-size: 12px;">
    <p>Bonjour ${fullname},</p>

    <p style="margin-top: 20px; line-height: 1.6;">
      Merci de vous être inscrit sur <strong>Donymusic</strong> ! <br /> Nous sommes ravis de vous compter parmi notre communauté d'apprenants passionnés par la musique.
    </p>

    <p style="margin-top: 20px; line-height: 1.6;">
      Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter à l'adresse suivante : <a href="mailto:contact@donymusic.com" style="color: #2563eb;">contact@donymusic.com</a>.
    </p>
  </main>

  <footer style="margin-top: 40px; font-size: 12px; color: #718096; line-height: 1.6; text-align: center;">
    <p>Nous vous souhaitons une expérience enrichissante et plein de succès !</p>
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
</section>
`;
};

export default generateRegisterEmailTemplate;
