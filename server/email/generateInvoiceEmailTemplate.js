const generateInvoiceEmailTemplate = ({ fullname, invoiceUrl }) => {
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
        <p class="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">Vous pouvez télécharger votre facture en cliquant sur le lien ci-dessous :</p>
     </div>

  
    <a
      href="${invoiceUrl}"
      target="_blank"
      class="mt-4 inline-block rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
    >
     Consulter ma facture
    </a>
  </main>

  <footer class="mt-8">
    <p><strong>Support :</strong></p>
    <p>Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter <a href="mailto:contact@donymusic.com">contact@donymusic.com</a>.</p>

    <p class="mt-3 text-gray-500 dark:text-gray-400">
        Nous vous souhaitons une expérience enrichissante et beaucoup de succès !
    </p>
    <p>Musicalement,</p>

    <div style="font-size:13px;color:#9ca3af;">
         <img src="https://donymusic.fr/logo-day.svg" style="width: 200px;" alt="logo-donymusic" /><br>
         123 Rue de la Musique, 75001 Paris, France<br>
         Téléphone : +33 1 23 45 67 89<br>
         Email : contact@donymusic.com
     </div>
  </footer>
</section>
`;
};

export default generateInvoiceEmailTemplate;
