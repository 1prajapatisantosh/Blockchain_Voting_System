import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Home: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-16 md:pt-20 lg:pt-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Secure Voting with <span className="text-primary">Blockchain Technology</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A transparent, tamper-proof, and efficient voting platform for elections of any scale, powered by blockchain technology.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {currentUser ? (
                  <Link to="/elections">
                    <button className="justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 rounded-md px-8 inline-flex items-center gap-1">
                      View Active Elections
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <button className="justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 rounded-md px-8 inline-flex items-center gap-1">
                        Get Started
                      </button>
                    </Link>
                    <Link to="/login">
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 rounded-md px-8">
                        Learn More
                      </button>
                    </Link>
                  </>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2 min-[400px]:flex-row min-[400px]:gap-4 sm:mt-6">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Private</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Global</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-[500px] overflow-hidden rounded-lg border bg-background p-2 shadow-xl">
                <div className="relative h-full w-full rounded-md bg-white p-4">
                  <div className="space-y-4">
                    <div className="h-8 w-24 rounded-full bg-primary/20"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-gray-200"></div>
                      <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="space-y-2 rounded-lg border border-gray-200 p-4">
                        <div className="h-12 w-12 rounded-full bg-primary/20"></div>
                        <div className="h-4 w-full rounded bg-gray-200"></div>
                        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                        <div className="h-8 w-full rounded-full bg-primary/10"></div>
                      </div>
                      <div className="space-y-2 rounded-lg border border-gray-200 p-4">
                        <div className="h-12 w-12 rounded-full bg-secondary/20"></div>
                        <div className="h-4 w-full rounded bg-gray-200"></div>
                        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                        <div className="h-8 w-full rounded-full bg-secondary/10"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Features That Make Us Different</h2>
            <p className="mb-12 text-muted-foreground">
              Our blockchain-based voting system combines security, transparency, and ease-of-use to create the most reliable digital voting platform.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-2 text-xl font-bold">Secure Voting</h3>
              <p className="text-sm text-muted-foreground">
                End-to-end encryption and blockchain technology ensures votes are secure, anonymous, and tamper-proof.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-2 text-xl font-bold">Privacy Protection</h3>
              <p className="text-sm text-muted-foreground">
                Voter identities are protected while maintaining transparency in the election process.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-2 text-xl font-bold">Global Accessibility</h3>
              <p className="text-sm text-muted-foreground">
                Vote from anywhere in the world with an internet connection, making participation easier for all eligible voters.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-2 text-xl font-bold">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">
                Follow election results as they happen with immediate and transparent vote counting.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-2 text-xl font-bold">Detailed Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive election statistics and voter turnout data for complete transparency.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-2 text-xl font-bold">Immutable Records</h3>
              <p className="text-sm text-muted-foreground">
                All votes are permanently recorded on the blockchain, providing an unalterable audit trail.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-2 text-xl font-bold">Fast Processing</h3>
              <p className="text-sm text-muted-foreground">
                Quick and efficient vote tallying with immediate verification and confirmation.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-2 text-xl font-bold">Voter Verification</h3>
              <p className="text-sm text-muted-foreground">
                Advanced authentication measures ensure only eligible voters can participate in elections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
            <p className="mb-12 text-muted-foreground">
              Our blockchain voting system combines cutting-edge technology with a simple user experience. Follow these steps to cast your secure vote:
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border bg-card text-card-foreground border-none shadow-md">
              <div className="flex flex-col items-center p-6 text-center">
                <div className="mb-2 flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold">Step 1</div>
                <h3 className="mb-2 mt-2 text-xl font-bold">Register & Verify</h3>
                <p className="text-sm text-muted-foreground">
                  Create an account with your credentials. Verify your identity through our secure verification process.
                </p>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground border-none shadow-md">
              <div className="flex flex-col items-center p-6 text-center">
                <div className="mb-2 flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold">Step 2</div>
                <h3 className="mb-2 mt-2 text-xl font-bold">Connect Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Link your blockchain wallet to your account. This ensures your vote is securely recorded on the blockchain.
                </p>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground border-none shadow-md">
              <div className="flex flex-col items-center p-6 text-center">
                <div className="mb-2 flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold">Step 3</div>
                <h3 className="mb-2 mt-2 text-xl font-bold">Browse Elections</h3>
                <p className="text-sm text-muted-foreground">
                  View all available elections you're eligible to participate in, including details about candidates and voting periods.
                </p>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground border-none shadow-md">
              <div className="flex flex-col items-center p-6 text-center">
                <div className="mb-2 flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold">Step 4</div>
                <h3 className="mb-2 mt-2 text-xl font-bold">Cast Your Vote</h3>
                <p className="text-sm text-muted-foreground">
                  Select your preferred candidate and submit your vote. Each vote is encrypted and added to the blockchain.
                </p>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground border-none shadow-md">
              <div className="flex flex-col items-center p-6 text-center">
                <div className="mb-2 flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold">Step 5</div>
                <h3 className="mb-2 mt-2 text-xl font-bold">Receive Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant verification that your vote has been recorded securely on the blockchain with a unique transaction ID.
                </p>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground border-none shadow-md">
              <div className="flex flex-col items-center p-6 text-center">
                <div className="mb-2 flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold">Step 6</div>
                <h3 className="mb-2 mt-2 text-xl font-bold">Track Results</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor election results in real-time as votes are counted transparently and securely on the blockchain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our secure blockchain-based voting platform and be part of the future of democracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 rounded-md px-8">
                Register as a Voter
              </button>
            </Link>
            <Link to="/login">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 rounded-md px-8">
                Login
              </button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
