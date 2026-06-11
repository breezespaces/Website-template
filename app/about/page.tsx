import PageNavBar from "@/components/PageNavBar";

export default function About() {
  return (
    <div className="min-h-screen bg-white font-syne">
      <PageNavBar />
      <div className="pt-32 pb-16 px-16 ml-10">
        <div className="max-w-2xl">
          {/* Main Content */}
          <div className="mb-5">
            <p className="text-black text-sm leading-relaxed">
              A luxury unisex fashion brand that provides
            </p>
            <p className="text-black text-sm leading-relaxed mb-6 mt-[-6px]">
              every aspect of fashion in great style and class.
            </p>
          </div>

          
          {/* Contact Section */}
          <div className="mt-16">
            <p className="text-xs text-black mb-6 leading-2.5">
              For inquiries, assistance, or to request catalogue,<br />
              reach out – we&apos;re here for you.
            </p>
            <div className="flex flex-wrap gap-12">
              <div>
                <p className="font-bold text-sm text-black mb-1">CUSTOMER SERVICE</p>
                <p className="text-xs text-black">Call : +234 7087547858</p>
              </div>
              <div>
                <p className="font-bold text-sm text-black mb-1">OPENING &amp; CLOSING HOURS</p>
                <p className="text-xs text-black">Monday to Friday: 9am - 5pm (GMT+1)</p>
                <p className="text-xs text-black">Saturday: 10am - 9pm (GMT+1)</p>
              </div>
              <div>
                <p className="font-bold text-sm text-black mb-1">HAVE A QUESTION?</p>
                <p className="text-xs text-black">abelfeliciaogechi@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
