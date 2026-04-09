export const DashboardContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="mx-auto w-full max-w-6xl p-6 my-6 bg-accent rounded-lg min-h-screen shadow-md flex flex-col">
    {children}
  </div>
);
