import useState from "react";
import useParams from "react-router-dom";

const { chapterId } = useParams();
const [progress, setProgress] = useState(0);
const BASE_URL = import.meta.env.VITE_API_URL;

const Progress = () => {
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (chapterId) {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/user-progress/${chapterId}`,
          );
          const { progress } = response.data;
          setProgress(progress);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération de la progression :",
            error,
          );
          setProgress(0);
        }
      }
    };

    fetchUserProgress();
  }, [chapterId]);

  const handleVideoEnd = async () => {
    if (!course || !selectedVideo || !user || !user.id) {
      return;
    }

    const chapter = course.chapters.find((chapter) =>
      chapter.videos.some((video) => video.id === selectedVideo.id),
    );

    if (!chapter) {
      console.error("No chapter found for the selected video.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/user-progress/create`,
        {
          userId: user.id,
          chapterId: chapter.id,
          progress: 100,
          isComplete: true,
          videoId: selectedVideo.id,
        },
      );

      setVideoProgress((prev) => ({
        ...prev,
        [selectedVideo.id]: response.data,
      }));

      const chapterProgressResponse = await axios.get(
        `${BASE_URL}/api/user-progress/${chapter.id}`,
      );
      const { progress, isComplete } = chapterProgressResponse.data;

      setProgress(progress);

      if (isComplete) {
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la progression :", error);
    }
  };

  return { progress, handleVideoEnd };
};

export default Progress;
