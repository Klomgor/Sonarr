using System;
using NLog;
using NzbDrone.Common.Extensions;
using NzbDrone.Core.Download;
using NzbDrone.Core.Organizer;
using NzbDrone.Core.Parser.Model;
using NzbDrone.Core.Tv;

namespace NzbDrone.Core.MediaFiles.EpisodeImport.Specifications
{
    public class AbsoluteEpisodeNumberSpecification : IImportDecisionEngineSpecification
    {
        private readonly IBuildFileNames _buildFileNames;
        private readonly Logger _logger;

        public AbsoluteEpisodeNumberSpecification(IBuildFileNames buildFileNames, Logger logger)
        {
            _buildFileNames = buildFileNames;
            _logger = logger;
        }

        public ImportSpecDecision IsSatisfiedBy(LocalEpisode localEpisode, DownloadClientItem downloadClientItem)
        {
            if (localEpisode.Series.SeriesType != SeriesTypes.Anime)
            {
                _logger.Debug("Series type is not Anime, skipping check");
                return ImportSpecDecision.Accept();
            }

            if (!_buildFileNames.RequiresAbsoluteEpisodeNumber())
            {
                _logger.Debug("File name format does not require absolute episode number, skipping check");
                return ImportSpecDecision.Accept();
            }

            foreach (var episode in localEpisode.Episodes)
            {
                var airDateUtc = episode.AirDateUtc;
                var absoluteEpisodeNumber = episode.AbsoluteEpisodeNumber;

                if (airDateUtc.HasValue && airDateUtc.Value.Before(DateTime.UtcNow.AddDays(-1)))
                {
                    _logger.Debug("Episode aired more than 1 day ago");
                    continue;
                }

                if (!absoluteEpisodeNumber.HasValue)
                {
                    _logger.Debug("Episode does not have an absolute episode number and recently aired");

                    return ImportSpecDecision.Reject(ImportRejectionReason.MissingAbsoluteEpisodeNumber, "Episode does not have an absolute episode number and recently aired");
                }
            }

            return ImportSpecDecision.Accept();
        }
    }
}
