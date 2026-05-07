export const styles = {
  glass: "backdrop-blur-md bg-white/5 border border-white/10",
  glassDark: "backdrop-blur-xl bg-black/40 border border-white/5",
  glassOrange: "backdrop-blur-md bg-orange-500/10 border border-orange-500/20",
  sidebarItem: "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
  sidebarItemActive: "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-900/20",
  sidebarItemInactive: "text-gray-400 hover:text-white hover:bg-white/5",
  card: "glass-card rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all duration-300",
  tableHeader: "text-left px-6 py-4 text-gray-400 font-semibold text-xs uppercase tracking-wider",
  tableRow: "border-b border-white/5 hover:bg-white/5 transition-all duration-200",
  tableCell: "px-6 py-4 text-sm",
  gradientOrange: "bg-gradient-to-br from-orange-900/30 to-amber-900/30",
  gradientGray: "bg-gradient-to-br from-gray-900/50 to-gray-900/30",
  gradientGrayToGray: "bg-gradient-to-br from-gray-900 to-gray-800",
  borderGray: "border border-gray-800",
  borderHoverOrange: "hover:border-orange-500/50 transition-all",
  borderOrange: "border border-orange-800/50",
  rounded2xl: "rounded-2xl",
  roundedXl: "rounded-xl",
  roundedLg: "rounded-lg",
  roundedFull: "rounded-full",
  roundedXl: "rounded-xl",
  textWhite: "text-white",
  textGray: "text-gray-400",
  textGray300: "text-gray-300",
  textOrange: "text-orange-400",
  textRed: "text-red-400",
  buttonPrimary:
    "px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white",
  buttonSecondary:
    "bg-gray-800/50 border border-gray-700 px-5 py-2.5 text-gray-300 rounded-xl",
  inputField:
    "bg-gray-800/50 border border-gray-700 w-full px-4 py-2.5 text-gray-200 rounded-lg",
  statCard: "p-5 w-full max-w-xs",
  carCard: "overflow-hidden duration-300",
  carImage: "w-full h-48 object-cover",
  statusBadge:
    "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
  modalOverlay:
    "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50",
  modalContainer:
    "shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto",
  noCarsContainer:
    "text-center py-16 rounded-2xl border border-gray-800 mt-8",
  filterSelect: "p-5 w-full max-w-xs",
};

export const AddCarPageStyles = {
  pageContainer:
    "min-h-screen p-4 sm:p-6",
  fixedBackground: "fixed inset-0 overflow-hidden pointer-events-none",
  gradientBlob1:
    "absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-orange-600 to-orange-800 blur-3xl opacity-10",
  gradientBlob2:
    "absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 blur-3xl opacity-10",
  gradientBlob3:
    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rotate-45 bg-gradient-to-r from-orange-500 to-amber-500 blur-xl opacity-10",
  headerContainer: "relative mb-8 pt-20 text-center",
  headerDivider: "absolute inset-x-0 top-0 flex justify-center",
  headerDividerLine:
    "h-1 w-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full",
  title:
    "text-4xl font-extrabold py-4 text-white sm:text-5xl mb-3 tracking-wide",
  titleGradient:
    "text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400",
  subtitle: "text-lg text-gray-400 max-w-2xl mx-auto",
  formContainer: "max-w-4xl mx-auto",
  form: "glass-card rounded-2xl shadow-xl p-6 sm:p-10 relative overflow-hidden border border-gray-700",
  formGrid: "grid grid-cols-1 lg:grid-cols-2 gap-8",
  formColumn: "space-y-6",
  label: "block text-sm font-medium text-gray-300 mb-2",
  input:
    "glass-input w-full px-4 py-3 rounded-xl text-gray-200 shadow-sm focus:ring-2 focus:ring-orange-500 transition-all",
  inputWithPrefix:
    "glass-input w-full pl-8 pr-4 py-3 rounded-xl text-gray-200 shadow-sm focus:ring-2 focus:ring-orange-500 transition-all",
  select:
    "bg-gray-800/50 border border-gray-700 w-full px-4 py-3 rounded-xl text-gray-200 focus:ring-2 focus:ring-orange-500",
  textarea:
    "glass-input w-full px-4 py-3 rounded-xl text-gray-200 shadow-sm focus:ring-2 focus:ring-orange-500 transition-all",
  imageUploadContainer: "flex items-center justify-center w-full",
  imageUploadLabel:
    "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer glass-input shadow-sm hover:bg-gray-900/30 transition-all",
  imageUploadPlaceholder: "flex flex-col items-center justify-center pt-5 pb-6",
  imageUploadText: "text-sm text-gray-400 text-center",
  imageUploadTextSemibold: "font-semibold",
  imageUploadSubText: "text-xs text-gray-500 mt-1",
  submitButton:
    "px-10 py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 text-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500",
  buttonText: "drop-shadow-md",
  iconSmall: "w-5 h-5 mr-2 text-orange-500",
  iconMedium: "w-6 h-6 mr-2 text-red-400",
  iconLarge: "w-8 h-8 mr-3 text-orange-400",
  iconInline: "w-5 h-5 ml-2 inline",
  iconUpload: "w-10 h-10 mb-3 text-orange-500/50 group-hover:text-orange-500 transition-colors",
  iconInline: "w-5 h-5 ml-2 inline",
  iconUpload: "w-10 h-10 mb-3 text-orange-500/50 group-hover:text-orange-500 transition-colors",
};

export const toastStyles = {
  success: {
    container:
      "bg-gradient-to-r from-gray-800 to-gray-900 border-l-4 border-orange-500",
    body: "font-sans text-gray-100",
  },
  error: {
    container: "bg-gradient-to-r from-gray-800 to-gray-900",
    body: "font-sans text-gray-100",
  },
};

export const BookingPageStyles = {
  pageContainer: "min-h-screen p-4 sm:p-6",
  fixedBackground: "fixed inset-0 overflow-hidden pointer-events-none",
  gradientBlob1:
    "absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-orange-600 to-orange-800 blur-3xl opacity-10",
  gradientBlob2:
    "absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 blur-3xl opacity-10",
  gradientBlob3:
    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rotate-45 bg-gradient-to-r from-orange-500 to-amber-500 blur-xl opacity-10",
  headerContainer: "relative mb-8 pt-16 text-center",
  headerDivider: "absolute inset-x-0 top-0 flex justify-center",
  headerDividerLine:
    "h-1 w-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full",
  title:
    "text-4xl font-extrabold py-4 text-white sm:text-5xl mb-3 tracking-wide",
  titleGradient:
    "text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400",
  subtitle: "text-gray-400 max-w-2xl mx-auto",
  searchFilterContainer:
    "bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-gray-800",
  searchFilterGrid: "grid grid-cols-1 md:grid-cols-3 gap-4",
  filterLabel: "block text-sm font-medium text-gray-400 mb-2",
  filterInput:
    "bg-gray-800/50 border border-gray-700 w-full px-4 py-2.5 pl-10 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500",
  filterIconContainer: "absolute left-3 top-3 text-orange-500",
  totalBookingsContainer:
    "bg-gradient-to-br from-orange-900/30 to-amber-900/30 rounded-lg p-4 border border-orange-800/30 flex items-center justify-center",
  totalBookingsLabel: "text-gray-400 text-sm mb-1",
  totalBookingsValue: "text-2xl font-bold text-orange-400",
  bookingCard:
    "bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all duration-300",
  bookingCardHeader: "flex items-center mb-4 md:mb-0",
  bookingIconContainer:
    "bg-gradient-to-br from-orange-800/50 to-amber-800/50 p-3 rounded-xl mr-4",
  bookingIcon: "text-orange-400 text-xl",
  bookingCustomer: "text-lg font-bold text-white",
  bookingEmail: "text-sm text-gray-400",
  bookingInfoGrid: "grid grid-cols-2 sm:grid-cols-4 gap-4",
  bookingInfoLabel: "text-xs text-gray-400",
  bookingInfoValue: "text-sm font-medium text-white",
  bookingAmount: "text-sm font-semibold text-orange-400",
  bookingEditButton:
    "bg-gradient-to-r from-orange-700/50 to-amber-700/50 text-orange-300 hover:text-white text-sm px-3 py-1 rounded-lg flex items-center",
  bookingDetails:
    "border-t border-gray-800 p-5 bg-gradient-to-br from-gray-900/30 to-gray-900/10",
  bookingDetailsGrid: "grid grid-cols-1 md:grid-cols-2 gap-6",
  panel: "bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800",
  panelTitle: "text-md font-bold text-white mb-4 flex items-center",
  panelIcon: "mr-2 text-orange-400",
  detailContainer: "flex items-start",
  detailIcon: "text-orange-400 mt-1 mr-3",
  detailLabel: "text-xs text-gray-400",
  detailValue: "text-sm font-medium text-white",
  specContainer:
    "flex flex-col items-center bg-gradient-to-br from-gray-900/30 to-gray-900/10 p-3 rounded-xl border border-gray-800 hover:border-orange-500/50 transition-all",
  specIcon: "text-xl mb-2 text-orange-400",
  specLabel: "text-xs text-gray-400",
  specValue: "font-semibold text-sm text-white",
  statusIndicator: (status) => {
    const config = {
      completed: "bg-green-900/20 text-green-400",
      pending: "bg-amber-900/20 text-amber-400",
      active: "bg-orange-900/20 text-orange-400",
      cancelled: "bg-red-900/20 text-red-400",
      default: "bg-gray-900/30 text-gray-400",
    };
    return `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
      config[status] || config.default
    }`;
  },
  statusIcon: (status) => {
    const config = {
      completed: "bg-green-500",
      pending: "bg-amber-500",
      active: "bg-orange-500",
      cancelled: "bg-red-500",
      default: "bg-gray-500",
    };
    return `w-2 h-2 rounded-full mr-2 ${config[status] || config.default}`;
  },
  noBookingsContainer:
    "bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-sm text-center py-16 rounded-2xl border border-gray-800",
  noBookingsIconContainer:
    "mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-orange-900/30 to-amber-900/30 flex items-center justify-center mb-6",
  noBookingsIcon:
    "bg-gradient-to-br from-orange-700 to-amber-700 w-16 h-16 rounded-full flex items-center justify-center",
  noBookingsIconSvg: "h-8 w-8 text-orange-300",
  noBookingsTitle: "mt-4 text-xl font-medium text-white",
  noBookingsText: "mt-2 text-gray-400",
  noBookingsButton:
    "mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center mx-auto",
  carImageContainer:
    "bg-gradient-to-br from-orange-900/30 to-amber-900/30 rounded-xl w-20 h-12 flex items-center justify-center",
};

export const statusConfig = {
  completed: { bg: "bg-green-900/20", text: "text-green-400" },
  pending: { bg: "bg-amber-900/20", text: "text-amber-400" },
  active: { bg: "bg-orange-900/20", text: "text-orange-400" },
  cancelled: { bg: "bg-red-900/20", text: "text-red-400" },
  default: { bg: "bg-gray-900/30", text: "text-gray-400" },
};
