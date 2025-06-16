const generatePurchaseEmailTemplate = ({ fullname, productTitle, payment, startDate, startTime, link }) => {
    return `
  <section class="mx-auto max-w-2xl bg-white px-6 py-8 dark:bg-gray-900">
    <main class="mt-8">
      <p>${fullname},</p>

      <div class="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <p class="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
          Nous vous remercions pour votre achat sur Donymusic !
        </p>
      </div>

      <div class="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <p class="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
          Nous sommes ravis de vous compter parmi nos clients et nous vous félicitons pour votre engagement à développer vos compétences musicales.
        </p>
      </div>

      <div class="mt-6 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <p class="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
          Voici les détails de votre achat :
        </p>
        <ul class="mt-2 text-sm text-gray-700 dark:text-gray-200">
          <li><strong>Masterclass :</strong> ${productTitle}</li>
          <li><strong>Montant payé :</strong> ${payment.amount}€</li>
          <li><strong>Date :</strong> ${startDate}</li>
          <li><strong>Heure :</strong> ${startTime}</li>
        </ul>
      </div>

      <p class="mt-8 text-gray-600 dark:text-gray-300">
        Vous pouvez accéder à votre masterclass via votre espace utilisateur ou en cliquant sur le lien suivant :
      </p>

      <a
        href="${link}"
        target="_blank"
        class="mt-4 inline-block rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Accéder à la masterclass
      </a>
    </main>

    <div className="mt-8">
      <P class="rounded-lg bg-yellow-50 p-4 text-sm text-gray-700 dark:bg-yellow-100 dark:text-gray-900">
      <strong>📌 Important :</strong> Nos formations s’étendent sur une période de <strong>3 mois</strong> et sont dispensées <strong>en direct chaque semaine</strong> (1 session hebdomadaire).
      <br /><br />
      Chaque cours est <strong>enregistré</strong> et le replay sera automatiquement disponible dans votre espace membre après chaque session.
      <br /><br />
      Si vous ne souhaitez pas apparaître à l’image, merci de <strong>désactiver votre caméra</strong> lors des sessions en direct.
      </P>
    </div>


    <footer class="mt-8">
      <p><strong>Support :</strong> Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter à <a href="mailto:contact@donymusic.fr">contact@donymusic.fr</a>.</p>

      <p class="mt-3 text-gray-500 dark:text-gray-400">
        Nous vous souhaitons une expérience enrichissante et beaucoup de succès !
      </p>
      <p>Musicalement,</p>

      <div style="font-size:13px;color:#9ca3af;">
        <img src="https://donymusic.fr/img/logo-day.svg" style="width: 200px;" alt="logo-donymusic" /><br>
        123 Rue de la Musique, 75001 Paris, France<br>
        Téléphone : +33 1 23 45 67 89<br>
        Email : contact@donymusic.fr
      </div>
    </footer>
  </section>
  `;
};

export default generatePurchaseEmailTemplate;
