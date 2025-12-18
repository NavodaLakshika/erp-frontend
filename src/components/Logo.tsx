function Logo() {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Logo Image */}
      <img
        src="/logo.png"
        alt="Logo"
        className="w-40 h-40 sm:w-56 sm:h-56 object-contain mb-2"
      />
    </div>
  );
}

export default Logo;
