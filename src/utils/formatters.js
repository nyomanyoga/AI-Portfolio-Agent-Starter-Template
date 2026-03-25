/**
 * Fungsi global untuk memformat tanggal agar mengikuti bahasa sistem yang aktif.
 */
export const formatDate = (dateString, options = { month: 'long', year: 'numeric' }) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(undefined, options);
};