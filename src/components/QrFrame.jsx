//   custom rounded square border frame

function QrFrame() {
  return (
    <div className="relative grid place-items-center sm:min-h-82 sm:min-w-82 min-w-66 min-h-66">
      {/* Main rounded square (invisible) */}
      <div className="size-[93.5%] sm:size-[94%] rounded-[42px] outline-[50vmax] outline-black/30" />

      {/* Top left corner */}
      <div className="absolute top-0 left-0">
        <div className="size-12 border-t-4 border-l-4  border-white rounded-tl-full" />
      </div>

      {/* Top right corner */}
      <div className="absolute top-0 right-0">
        <div className="size-12 border-t-4 border-r-4 border-white rounded-tr-full" />
      </div>

      {/* Bottom left corner */}
      <div className="absolute bottom-0 left-0">
        <div className="size-12 border-b-4 border-l-4 border-white rounded-bl-full" />
      </div>

      {/* Bottom right corner */}
      <div className="absolute bottom-0 right-0">
        <div className="size-12 border-b-4 border-r-4 border-white rounded-br-full" />
      </div>
    </div>
  );
}

export default QrFrame;
