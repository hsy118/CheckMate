package com.ssafy.checkmate.answer.controller;

import com.ssafy.checkmate.answer.dto.Answer;
import com.ssafy.checkmate.answer.service.AnswerService;
import com.ssafy.checkmate.answer.vo.UpdateRequestAnswer;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Api(tags = "answers", description = "답변 API")
@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/answers")
public class AnswerController {

    private final AnswerService answerService;

    @ApiOperation(value = "답변하기", notes = "질문에 대한 첨삭을 진행합니다.")
    @PostMapping
    public void addAnswer(@RequestBody Answer answer) {

        answerService.addAnswer(answer);
    }

    @ApiOperation(value = "답변조회", notes = "답변 목록을 받아옵니다.")
    @GetMapping("/list/{questionId}/{offset}/{limit}")
    public Map<String, Object> readAnswer(@PathVariable Long questionId, @PathVariable int offset, @PathVariable int limit) {

        Map<String, Object> resultMap = new HashMap<>();

        resultMap.put("list", answerService.getAnswer(questionId, offset, limit));
        resultMap.put("totalSize", answerService.getAnswerSize(questionId));

        return resultMap;
    }

    @ApiOperation(value = "답변수정", notes = "답변 내용을 수정합니다.")
    @PutMapping
    public void updateAnswer(@RequestBody UpdateRequestAnswer updateRequestAnswer) {

        answerService.putAnswer(updateRequestAnswer);
    }
}
