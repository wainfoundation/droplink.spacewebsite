
const Testimonials = () => {
  // Generate avatar URL from name using a reliable service
  const getAvatarUrl = (name: string) => {
    const encoded = encodeURIComponent(name);
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encoded}&backgroundColor=random`;
  };

  return (
    <section className="py-20 px-6 bg-muted">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Community Love</h2>
        <p className="text-lg mb-12 max-w-2xl mx-auto">
          Hear from creators thriving with Droplink.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="testimonial-card">
            <img 
              src={getAvatarUrl("CreatorJane")}
              alt="Jane Avatar" 
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = `https://ui-avatars.com/api/?name=Jane&background=0D8ABC&color=fff&rounded=true`;
              }}
            />
            <div className="flex-1">
              <div className="flex mb-2 text-primary">
                ★★★★★
              </div>
              <blockquote className="italic text-gray-700 mb-4 border-l-4 border-primary pl-3">
                "Droplink simplifies my art sales with Pi!"
              </blockquote>
              <h4 className="font-medium text-primary">— @CreatorJane, Artist</h4>
            </div>
          </div>
          
          <div className="testimonial-card">
            <img 
              src={getAvatarUrl("ArtistMike")}
              alt="Mike Avatar" 
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = `https://ui-avatars.com/api/?name=Mike&background=0D8ABC&color=fff&rounded=true`;
              }}
            />
            <div className="flex-1">
              <div className="flex mb-2 text-primary">
                ★★★★★
              </div>
              <blockquote className="italic text-gray-700 mb-4 border-l-4 border-primary pl-3">
                "Pi payments make earning a breeze!"
              </blockquote>
              <h4 className="font-medium text-primary">— @ArtistMike, Musician</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
