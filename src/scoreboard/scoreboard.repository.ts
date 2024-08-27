import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Scoreboard, ScoreboardDocument, UserScore } from "./scoreboard.schema";
import { Model, Types } from "mongoose";
import { CreateSubmissionDto, ScoreboardResponseDto } from "./scoreboard.dto";

@Injectable()
export class ScoreboardRepository {
  constructor(@InjectModel(Scoreboard.name) private contestModel: Model<ScoreboardDocument>) { }

  async createScoreboard(contest: string): Promise<void> {
    const scoreboard = new this.contestModel({ contest: new Types.ObjectId(contest) });
    scoreboard.participants.map(participant => {
      const userScore: UserScore = {
        problemSubmissions: new Map(),
        profile: new Types.ObjectId(participant)
      }
      scoreboard.problems.map(problem => {
        userScore.problemSubmissions.set(new Types.ObjectId(problem), {
          panelty: 0,
          problem: new Types.ObjectId(problem),
          score: 0,
          solved: false,
          submittedAt: []
        });
      });
      scoreboard.userScores.set(new Types.ObjectId(participant), userScore);
    });

    await scoreboard.save();
  }

  async findScoreboardByContest(contest: string) : Promise<ScoreboardResponseDto> {
    return await this.contestModel.findOne({ contest: new Types.ObjectId(contest) });
  }

  async updateScoreboardByContest(contest: string, scoreboard: Scoreboard): Promise<void>{
    await this.contestModel.findOneAndUpdate({ contest: new Types.ObjectId(contest) }, scoreboard, { new: true });
  }

  async deleteScoreboardByContest(contest: string): Promise<void> {
    await this.contestModel.findOneAndDelete({ contest: new Types.ObjectId(contest) });
  }

  async createSubmission(contest: string, createSubmissionDto: CreateSubmissionDto): Promise<void> {
    const scoreboard = await this.contestModel.findOne({ contest: new Types.ObjectId(contest) });
    const userScore = scoreboard.userScores.get(new Types.ObjectId(createSubmissionDto.profile));
    const problemSubmission = userScore.problemSubmissions.get(new Types.ObjectId(createSubmissionDto.problem));
    if (problemSubmission.solved) {
      return;
    }

    problemSubmission.solved = createSubmissionDto.solved;
    problemSubmission.panelty += createSubmissionDto.solved ? 1 : 0;
    problemSubmission.score = createSubmissionDto.solved ? createSubmissionDto.score : 0;
    problemSubmission.submittedAt.push(new Date());

    userScore.problemSubmissions.set(new Types.ObjectId(createSubmissionDto.problem), problemSubmission);
    scoreboard.userScores.set(new Types.ObjectId(createSubmissionDto.profile), userScore);
    scoreboard.lastUpdated = new Date();
    
    await this.updateScoreboardByContest(contest, scoreboard);    
  }
}